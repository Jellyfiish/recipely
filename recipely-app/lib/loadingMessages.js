const loadingMessages = {};

loadingMessages.lines = [
  "Need more potatoes...",
  "Refactoring to use Backbone...",
  "Refactoring to use AngularJS directives only...",
  "Getting pepped...",
  "Paying respects to Aaliyah...",
];

loadingMessages.random = () => {
  const lines = loadingMessages.lines;
  const index = Math.floor(Math.random() * lines.length);
  return lines[index];
};

export default loadingMessages;
