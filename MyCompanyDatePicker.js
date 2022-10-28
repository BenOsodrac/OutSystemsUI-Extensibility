class MyCompanyDatePicker {
    // Public field declarations;
    dateFormat = 'M d, Y';
    endDate = '';
    initialDate = ''
    pickerId;
    pickerInstance;
    // Private field declarations
    #elm;
    #inputFinalValue = '';
    #onDateSelectEvent;
    #resetButton;
    #wrapper;

    constructor(datePickerId, onDateSelectEventHandler){
        this.pickerId = datePickerId;
        this.#onDateSelectEvent = onDateSelectEventHandler;
    
        // Init custom picker async, to wait for provider to finish mounting the picker
        setTimeout(()=> {
            this.pickerInstance = OutSystems.OSUI.Patterns.DatePickerAPI.GetDatePickerItemById(datePickerId).provider;
            this.mount();
        }, 0)
    }

    mount() {
        const container = this.pickerInstance.innerContainer;
        this.#wrapper = document.createElement( 'footer' );
        this.#wrapper.classList.add('picker-footer');
        this.#elm = document.createElement('div');
        this.#wrapper.appendChild(this.#elm);

        // Call method to create the buttons and add their CSS classes and click listener
        this.createPickerButtons('button', 'cancel', 'Reset', this.onReset.bind(this));
        this.createPickerButtons('button', 'btn-primary', 'Apply', this.onApply.bind(this));

        // Insert them on the footer element
        container.parentElement.insertBefore(this.#wrapper, container.nextSibling );

        // Set the initial values on the footer section
        this.update();

        // Add the update() method as a callback to the DatePicker onChange event
        this.pickerInstance.config.onChange.push(this.update.bind(this));
    }

    // Helper method to create buttons on footer section
    createPickerButtons(tag, className, textContent, clickHandler) {
        const newElement = document.createElement(tag);
        newElement.className = 'btn btn-small ' + className;
        newElement.textContent = textContent;
        newElement.onclick = clickHandler;
        this.#wrapper.appendChild(newElement);
    }

    // Method to update info on footer section
    update() {
        this.#inputFinalValue = this.pickerInstance.altInput.value;
        this.pickerInstance.altInput.value = '';

        if(this.pickerInstance && this.pickerInstance.selectedDates.length > 1) {
            this.initialDate = this.pickerInstance.formatDate(this.pickerInstance.selectedDates[0], this.dateFormat);
            this.endDate = this.pickerInstance.formatDate(this.pickerInstance.selectedDates[1], this.dateFormat);
        }

        setTimeout(()=> {
            this.#elm.innerHTML = `<span>
            <strong>From </strong></span>${this.initialDate}<br><strong>to </strong>${this.endDate}`;
        },0);
    }

    // Method to close the DatePicker, trigger the event and update the input with the selected values
    onApply() {
        this.pickerInstance.altInput.value = this.#inputFinalValue;
        this.pickerInstance.close();
        this.#onDateSelectEvent();
    }

    // Method to clear the selected date on the input
    onReset() {
        this.pickerInstance.clear();
        this.initialDate = '';
        this.endDate = '';
    }

    // Method to remove the created html elements and destroy the instance
    destroy() {
        this.#elm.remove();
        this.pickerInstance = undefined;
    }
}