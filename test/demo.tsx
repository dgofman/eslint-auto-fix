import React from 'react';

const Demo: React.FC = () => {

  const nonInteractiveElements = () => true;

  return (
    // lintfix/jsx-a11y
    // eslintjsx-a11y/click-events-have-key-events - Visible, non-interactive elements with click handlers must have at least one keyboard listener.
    // eslintjsx-a11y/no-static-element-interactions - Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for 
    //                                                                                          tabbing, mouse, keyboard, and touch inputs to an interactive content element.        
    <div onClick={nonInteractiveElements}></div> // added: aria-hidden="true"
  );
};

// lintfix/jsx-a11y
// A form label must be associated with a control  - jsx-a11y/label-has-associated-control
export const HasLabel = (): JSX.Element => {
    return (<><label>Label:</label><input/></>);  // added: htmlFor="label"
};

// lintfix/no-unescaped
// `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`  react/no-unescaped-entities
export const noUnescapeApos = (): any => {
  return (<div>You're Here</div>); //replace: &apos;
};

// `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`  react/no-unescaped-entities
export const noUnescapeQuot = (): any => {
  return (<div>You are "Here"</div>); //replace: &quot;
};

// lintfix/react
// Component definition is missing display name - react/display-name
export const DisplayName: React.FunctionComponent<any> = React.memo(() => {
  return (<div></div>);
});
// added: DisplayName.displayName = 'DisplayName';

// lintfix/no-duplicate-props
// No duplicate props allowed - react/jsx-no-duplicate-props
/*
<RespondentList
    searchResults={searchResults}
    respondentsRegistrations={respondentsRegistrationsData}
    respondents={searchResults.candidates}
    candListHotkeys={candListHotkeys}
    searchResults={searchResults} // REMOVE THIS LINE
  />
*/

// TODO
export const ReactPropTypes = ({ prop }): JSX.Element => {
  // 'prop' is missing in props validation. - react/prop-types
  // Object pattern argument should be typed. - eslint@typescript-eslint/explicit-module-boundary-types
  return (<div title={prop === 'active' ? 'inactive' : 'active'}></div>);
};

export const ReactKeys = (): JSX.Element[] => {
  // warning  Missing "key" prop for element in iterator - react/jsx
  return ([1, 2, 3].map((item) => <div>{item}</div>)); // add: <div key={item}>... or .map((item, index) => <div key={index}>...
};

export const Anchor = (): JSX.Element => {
  // Anchor used as a button. Anchors are primarily expected to navigate. Use the button element instead. - jsx-a11y/anchor-is-valid
  return (<a onClick={() => false}>Click Here</a>); // replace <a href={window.location.pathname} ... or <div onClick={() => false}>Click Here</div>
};

export default Demo;