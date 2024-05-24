import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class TextInputComponent implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _element: HTMLInputElement;
    private _container: HTMLDivElement;
    private _clearButton: HTMLButtonElement;
    private _value: string;
    private _notifyOutputChanged: () => void;

    constructor() {
        // Empty constructor
    }

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this._container = container;
        context.mode.trackContainerResize(true);
        this._container.classList.add("my-custom-input-container");

        this._element = document.createElement("INPUT") as HTMLInputElement;
        this._element.setAttribute("type", "text");
        this._element.value = context.parameters.enteredText.raw || "";
        this._notifyOutputChanged = notifyOutputChanged;

        // Create the clear button
        this._clearButton = document.createElement("button");
        this._clearButton.type = "button";
        this._clearButton.innerHTML = "&#x2715;";  // Unicode for the 'X' symbol
        this._clearButton.classList.add("clear-button");

        // Inject CSS styles
        this.injectCSS();

        // Set initial dimensions
        this.setElementDimensions(context);

        // Add event listeners
        this._element.addEventListener("keydown", this.onKeyDown.bind(this));
        this._element.addEventListener("input", this.onInputChange.bind(this));
        this._clearButton.addEventListener("click", this.clearInput.bind(this));

        // Append elements to the container
        this._container.appendChild(this._element);
        this._container.appendChild(this._clearButton);

        // Show or hide the clear button based on initial value
        this.updateClearButtonVisibility();
    }

    private injectCSS(): void {
        const style = document.createElement("style");
        style.innerHTML = `
            .my-custom-input-container {
                display: flex;
                position: relative;
                width: 100%;
                height: 100%;
            }

            .my-custom-input-container input[type=text], .my-custom-input-container select {
                flex: 1;
                padding: 12px 10px;
                padding-right: 30px;  /* Adjusted right padding to accommodate clear button */
                margin: 8px 0;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-sizing: border-box;
                height: 100%;
            }

            .clear-button {
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                cursor: pointer;
                font-size: 16px;
                color: #aaa;
                display: none;  /* Initially hidden */
            }

            .clear-button:hover {
                color: #000;
            }

            .my-custom-input-container input[type=text]:not(:placeholder-shown) + .clear-button {
                display: block;  /* Show the button when there is text */
            }
        `;
        document.head.appendChild(style);
    }

    private onKeyDown(event: KeyboardEvent): void {
        if (event.key === "Enter") {
            this._value = this._element.value;
            this._notifyOutputChanged();
        }
    }

    private onInputChange(): void {
        this.updateClearButtonVisibility();
        this._value = this._element.value;
        this._notifyOutputChanged();
    }

    private clearInput(): void {
        this._element.value = "";
        this._value = "";
        this._notifyOutputChanged();
        this.updateClearButtonVisibility();
    }

    private updateClearButtonVisibility(): void {
        this._clearButton.style.display = this._element.value ? "block" : "none";
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Update the control view if necessary
        if (context.parameters.enteredText.raw !== this._value) {
            this._value = context.parameters.enteredText.raw || "";
            this._element.value = this._value;
        }

        // Show or hide the clear button based on input value
        this.updateClearButtonVisibility();

        // Update dimensions
        this.setElementDimensions(context);
    }

    private setElementDimensions(context: ComponentFramework.Context<IInputs>): void {
        this._element.style.width = '100%';
        this._element.style.height = '100%';
    }

    public getOutputs(): IOutputs {
        return {
            enteredText: this._value
        };
    }

    public destroy(): void {
        // Cleanup if necessary
        this._element.removeEventListener("keydown", this.onKeyDown.bind(this));
        this._element.removeEventListener("input", this.onInputChange.bind(this));
        this._clearButton.removeEventListener("click", this.clearInput.bind(this));
    }
}
