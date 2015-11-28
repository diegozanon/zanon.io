// Workaround to avoid flickering in prerendered content

// This site is prerendered to enhance SEO
// However, for normal users, ng-view is rendered two times
// To avoid this, ng-cloak is used
// CSS is added with JavaScript to avoid hiding cotents from crawlers
// See more in: https://docs.angularjs.org/api/ng/directive/ngCloak

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '.ng-cloak { display: none !important; }';
document.getElementsByTagName('head')[0].appendChild(style);