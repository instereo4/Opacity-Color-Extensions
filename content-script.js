"use strict";

function generatePseudoElementStyle() {
  return `
  #customPanelRoot{
    position: fixed;
    bottom: 10px;
    right: 10px;
    display: flex;
    flex-direction: row-reverse;
    gap: 20px;
    align-items: flex-end;
  }
  #customPanelButton{
    width: fit-content;
    height: 29px;
    padding: 2px;
    cursor: pointer;
    border-radius: 50%;
    border: none;
    box-shadow: 0px 1px 4px #00000010;
    background-color: transparent;
    transition: transform 100ms ease;
  }
  #customPanelButton:hover{
    
  }
  #customPanelButton:active{
    transform: scale(0.9);
  }
  #customPanelImg{
    width: 25px;
    height: 25px;
    transition: transform 0.3s ease;
  }

  #customPanelImg:hover{
    width: 25px;
    height: 25px;
    animation: spin 1s infinite linear;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  
  
  #customPanelContainer {
    display: flex;
    gap: 20px;
    justify-content: center;
    align-items: center;
    padding: 10px;
    background: ${invertedColor}60;
    border: 2px solid ${colorUpdate};
    border-radius: 5px;
    backdrop-filter: blur(6px);
    z-index: 999;
    opacity: 0.2;
    transition: opacity 0.5s ease-out;
    box-shadow: 0px 0px 2px ${invertedColor};
    visibility: collapse;
  }
  
  .textCustomLabel {
    color: ${colorUpdate};
    font-family: Roboto, Arial;
    font-size: 16px;
    font-weight: bold;
    text-shadow: 1px 1px 3px black;
  }
  
  #customPanelContainer:hover {
    opacity: 1;
  }
  #customPanelContainer > #inputColorStyled {
    -webkit-appearance: none;
    -moz-appearance: none;
    border: none;
    appearance: none;
    margin: 0;
    width: 40px;
    height: 40px;
    border: none;
    outline: none;
    cursor: pointer;
    background-color: transparent;
  }
  #customPanelContainer > #inputColorStyled::-webkit-color-swatch {
    border-radius: 8px;
    border: 4px double #fff;
    
  }
  #customPanelContainer > #inputColorStyled::-moz-color-swatch {
    border-radius: 8px;
    border: 4px double #fff;
  }
  label {text-transform: uppercase; }
  #opacityCustomSlider {
    accent-color: ${colorUpdate};
    appearance: auto;
  }
  `;
}

function inverterCorHex(hexColor) {
  if (!/^#[0-9A-Fa-f]{6}$/.test(hexColor)) {
    console.error("Formato de cor hexadecimal inválido");
    return null;
  }
  // Remove o símbolo # e converte para um número inteiro
  const intValue = parseInt(hexColor.slice(1), 16);
  // Calcula o complemento subtraindo o valor de cada canal RGB de 255
  const invertedValue = 0xffffff ^ intValue;
  // Converte de volta para formato hexadecimal e adiciona o símbolo #
  const invertedHexColor = `#${invertedValue.toString(16).padStart(6, "0")}`;

  return invertedHexColor;
}

var colorUpdate;
var invertedColor;

function destroyContent() {
  if (!!document.querySelector("#customPanelRoot")) {
    const customPanelRoot = document.querySelector("#customPanelRoot");
    customPanelRoot.remove();
  }
}

function main() {
  // Default values
  var defaultOpacity = 0.8;
  var defaultBackgroundColor = "#000000";

  //
  var styleTag = document.createElement("style");
  styleTag.type = "text/css";
  styleTag.id = "myOwnStyle";

  colorUpdate = localStorage.getItem("colorUpdate") || "#FF1264";
  var invertedColor = inverterCorHex(colorUpdate);

  var storedOpacity = localStorage.getItem("opacity");
  //var opacity = storedOpacity ? parseFloat(storedOpacity) : defaultOpacity;

  // Define pseudo-element styles (e.g., :hover)
  // var pseudoElementStyle = ;
  var pseudoElementStyle = generatePseudoElementStyle();
  styleTag.appendChild(document.createTextNode(pseudoElementStyle));
  document.head.appendChild(styleTag);
  //

  // Create UI elements
  var customPanelRoot = document.createElement("div");
  customPanelRoot.id = "customPanelRoot";
  customPanelRoot.style.zIndex = 999;

  var customPanelButton = document.createElement("button");
  customPanelButton.id = "customPanelButton";
  customPanelButton.title = "Opacity & Color Change";

  // Show/Hide main content on Click.
  customPanelButton.addEventListener("click", () => {
    if (customPanel.style.visibility == "collapse") {
      customPanel.style.visibility = "visible";
    } else {
      customPanel.style.visibility = "collapse";
    }
  });
  var customPanelImg = document.createElement("img");
  customPanelImg.id = "customPanelImg";
  const imgIcon = "logo-op-bg-cc-small.png";
  customPanelImg.src = imgIcon;

  var customPanel = document.createElement("div");
  customPanel.id = "customPanelContainer";
  customPanel.style.visibility = "collapse";
  // Opacity slider
  var opacityLabel = document.createElement("label");
  opacityLabel.innerHTML = "Opacity: ";
  opacityLabel.className = "textCustomLabel";

  var opacitySlider = document.createElement("input");
  opacitySlider.id = "opacityCustomSlider";
  opacitySlider.type = "range";
  opacitySlider.min = 0;
  opacitySlider.max = 1;
  opacitySlider.step = 0.1;
  opacitySlider.value = defaultOpacity.toFixed(1);
  opacityLabel.appendChild(opacitySlider);

  // Background color input
  var colorLabel = document.createElement("label");
  colorLabel.innerHTML = "Background Color: ";
  colorLabel.className = "textCustomLabel";

  var colorInput = document.createElement("input");
  colorInput.type = "color";
  colorInput.id = "inputColorStyled";

  //

  colorInput.value = defaultBackgroundColor;
  colorLabel.appendChild(colorInput);

  // Function to generate dynamic CSS based on colorUpdate value
  function generateDynamicStyles(colorUpdate) {
    pseudoElementStyle = generatePseudoElementStyle();
    console.log(pseudoElementStyle);
    return pseudoElementStyle;
  }

  // Update styles when color changes
  function updateStyles() {
    const dynamicStyles = generateDynamicStyles(colorUpdate);
    console.log("dynamic styles: ", dynamicStyles);
    styleTag.innerHTML = dynamicStyles;
  }
  //Invoke function when change the value by user.
  opacitySlider.addEventListener("change", applyChanges);
  colorInput.addEventListener("change", function () {
    colorUpdate = colorInput.value;
    invertedColor = inverterCorHex(colorUpdate);
    updateStyles();
    applyChanges();
  });
  // Append UI elements to the custom panel
  customPanelRoot.appendChild(customPanelButton);
  customPanelRoot.appendChild(customPanel);
  customPanelButton.appendChild(customPanelImg);
  customPanel.appendChild(opacityLabel);
  customPanel.appendChild(opacitySlider);
  customPanel.appendChild(colorLabel);
  customPanel.appendChild(colorInput);

  // Append the custom panel to the document
  document.documentElement.appendChild(customPanelRoot);

  // Apply styles to the body element
  function applyChanges() {
    var bodyElement = document.body;
    if (bodyElement) {
      // Set opacity
      bodyElement.style.opacity = opacitySlider.value;
      // Set background color
      bodyElement.style.backgroundColor = colorInput.value;
      colorUpdate = colorInput.value;
      window.content.localStorage.setItem("colorUpdate", colorUpdate);
      window.content.localStorage.setItem("opacity", opacitySlider.value);
    }
  }

  // Run the customization when the DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyChanges);
  } else {
    applyChanges();
  }
}

(function () {
  main();
  chrome.runtime.onMessage.addListener(function (message) {
    if (
      message.action === true &&
      !document.querySelector("#customPanelRoot")
    ) {
      main();
    }
    if (message.action === false) {
      destroyContent();
    }
  });
})();
