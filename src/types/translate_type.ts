export interface Messages {
    navigation: {
      contactUs: string;
    };
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
    moreAboutUs: {
      title: string;
    };
    aboutUs: {
      title: string;
      subtitle: string;
      machines: {
        title: string;
        closedMachines: {
          title: string;
          description: string;
        };
        glassMachines: {
          title: string;
          description: string;
        };
        combinedUnits: {
          title: string;
          description: string;
        };
      };
      operationHours: {
        title: string;
        weekdays: {
          title: string;
          hours: string;
        };
        holidays: {
          title: string;
          hours: string;
        };
      };
      uniqueService: {
        title: string;
        description: string;
      };
    };
    contact: {
      title: string;
      description: string;
      form: {
        name: string;
        email: string;
        phone: string;
        company_name: string;
        mechine_location: string;
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
      backToRequest: string;
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
      anotherRequest: string;
      returnHome: string;
    };
    statusPageContact: {
      title: string;
      message: string;
      anotherRequest: string;
      returnHome: string;
    };
  }