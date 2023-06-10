import Step from 'shepherd.js/src/types/step';

export interface WalkthroughItem {
  storageKey: string;
  config: Step.StepOptions
}

const genericScrollToTop = () => {
  return new Promise((resolve) => {
    setTimeout(function() {
      window.scrollTo(0, 0);
      resolve('');
    }, 500);
  });
}

export const WALKTHROUGHS: WalkthroughItem[] = [{
  storageKey: 'feedbackCommentsWalkthrough', 
  config: {
    id: 'feedbackComments',
    attachTo: { 
      element: '#feedbackCommentTrigger', 
      on: 'bottom'
    },
    beforeShowPromise: genericScrollToTop,
    cancelIcon: {
      enabled: true
    },
    scrollTo: true,
    title: 'Feedback Comments',
    text: ['You can now add comments to the sessions 🚀']
  },
}];