import { createSelectors } from 'pages/selectors';

const selectors = createSelectors({
  selectExampleResult: state => selectors.selectPageState(state, 'example').testMessage,
});

export default selectors;
