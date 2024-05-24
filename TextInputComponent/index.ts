import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class TextInputComponent implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _element: HTMLInputElement;
    private _container: HTMLDivElement;
    private _value: string;
    private _notifyOutputChanged: () => void;

    constructor() {
        // Empty constructor
    }

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this._container = container;
        this._container.classList.add("my-custom-input-container");

        this._element = document.createElement("INPUT") as HTMLInputElement;
        this._element.setAttribute("type", "text");
        this._element.value = context.parameters.enteredText.raw || "";
        this._notifyOutputChanged = notifyOutputChanged;

        // Inject CSS styles
        this.injectCSS();

        // Set initial dimensions
        this.setElementDimensions(context);

        // Add event listener for Enter key press
        this._element.addEventListener("keydown", this.onKeyDown.bind(this));

        container.appendChild(this._element);
    }

    private injectCSS(): void {
        const style = document.createElement("style");
        style.innerHTML = `
            .my-custom-input-container {
                display: flex;
                width: 100%;
                height: 100%;
            }

            .my-custom-input-container input[type=text], .my-custom-input-container select {
                flex: 1;
                padding: 12px 10px;  /* Adjusted left padding to 10px */
                margin: 8px 0;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-sizing: border-box;
                height: 100%;  /* Ensure the input box fills the height of the container */
            }

            .my-custom-input-container input[type=submit] {
                width: 100%;
                background-color: #4CAF50;
                color: white;
                padding: 14px 20px;
                margin: 8px 0;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }

            .my-custom-input-container input[type=submit]:hover {
                background-color: #45a049;
            }

            .my-custom-input-container div {
                border-radius: 5px;
                background-color: #f2f2f2;
                padding: 20px;
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

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Update the control view if necessary
        if (context.parameters.enteredText.raw !== this._value) {
            this._value = context.parameters.enteredText.raw || "";
            this._element.value = this._value;
        }

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
    }
}
