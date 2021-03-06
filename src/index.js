const loaderUtils = require('loader-utils');
const getComponentName = (componentPath) => {
  const componentPathSegments = componentPath.split('/');

  //return the second-to-last segment
  return componentPathSegments.slice(-2, -1)[0];
};

module.exports = function (source) {
  let componentName;
  let loaderSource = source;

  this.value = loaderSource;
  this.cacheable && this.cacheable();
  try {
    componentName = getComponentName(loaderUtils.getRemainingRequest(this));
  }
  catch (e) {
    return source;
  }
  try {
    loaderSource = `${source};
    window.document.addEventListener("DOMContentLoaded", function(event) {
      window.setTimeout(function(){
        const elems = document.querySelectorAll('[toga=${componentName}]');
        [].forEach.call(elems, function(elem) {
          let props;
          try {
            props = JSON.parse(elem.getAttribute('props'));
          } catch (e) {
            props = {};
          }
          const Component = (typeof exports.default === 'undefined')
              ? module.exports
              : exports.default;
          ReactDOM.render(<Component {...props}/>, elem);
        });
      }, 1);
    });`;
  }
  catch (e) {
    return source;
  }
  this.value = loaderSource;

  return loaderSource;
};
