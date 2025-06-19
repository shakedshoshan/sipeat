export interface Messages {
    hero: {
      slogan: string;
      learnMore: string;
      contact: string;
    };
    whoAreWe: {
      title: string;
      description: string;
    };
    whyChooseUs: {
      title: string;
      reasons: {
        support: {
          title: string;
          description: string;
        };
        price: {
          title: string;
          description: string;
        };
        customer: {
          title: string;
          description: string;
        };
      };
    };
    suitableFor: {
      title: string;
      description: string;
      cta: {
        title: string;
        description: string;
        button: string;
      };
    };
    contact: {
      title: string;
      description: string;
      form: {
        name: string;
        email: string;
        phone: string;
        message: string;
        submit: string;
        error?: string;
        submitting?: string;
      };
    };
    backToTop: string;
    requestPage: {
      title: string;
      backToHome: string;
    };
    requestForm: {
      title: string;
      customerName: string;
      customerNamePlaceholder: string;
      drinkName: string;
      drinkNamePlaceholder: string;
      selectMachine: string;
      selectMachinePlaceholder: string;
      loadingMachines: string;
      submitButton: string;
      submittingButton: string;
      errorLoadingMachines: string;
    };
    statusPage: {
      title: string;
      message: string;
      returnHome: string;
    };
  }