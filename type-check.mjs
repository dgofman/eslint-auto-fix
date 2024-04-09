
import path from 'path';
import ts from 'typescript';
import { unlink } from 'fs';

const configFilePath = ts.findConfigFile('.', ts.sys.fileExists, 'tsconfig.json');
const projectPath = path.resolve(path.dirname(configFilePath));
const configFile = ts.readConfigFile(configFilePath, ts.sys.readFile);
const tsBuildInfoFile = path.join(projectPath, 'tsconfig.tsbuildinfo');
const compilerOptions = ts.parseJsonConfigFileContent(configFile.config, ts.sys, './', {
  incremental: true,
  tsBuildInfoFile,
  outDir: 'tmp',
  noEmit: true,
});

const program = ts.createIncrementalProgram({
  rootNames: compilerOptions.fileNames,
  options: compilerOptions.options,
});

const preEmitDiagnostics = ts.getPreEmitDiagnostics(program);
const emitResult = program.emit();
const buildInfoEmitResult = program.emitBuildInfo();

const diagnostics = [
  ...preEmitDiagnostics,
  ...emitResult.diagnostics,
  ...buildInfoEmitResult.diagnostics,
].filter(it => !it.file.fileName.startsWith(projectPath.replaceAll(path.sep, '/') + '/node_modules'));

const errorCount = ts.getErrorCountForSummary(diagnostics);
const filesInError = ts.getFilesInErrorForSummary(diagnostics);
const diagnosticsReporter = ts.createDiagnosticReporter(ts.sys, true);

const reportDiagnostics = (diagnostics) => diagnostics.forEach(diagnosticsReporter);
const reportSummary = (errorCount, filesInError) =>
  // eslint-disable-next-line no-undef
  console.debug('LOG: type-check -', ts.getErrorSummaryText(errorCount, filesInError, ts.sys.newLine, ts.sys));

reportDiagnostics(diagnostics);
reportSummary(errorCount, filesInError);

unlink(tsBuildInfoFile, (err) => {
  // eslint-disable-next-line no-undef
  process.exit(err ? 1 : errorCount);
});