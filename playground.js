import init, { format } from "./wasm/nginxfmt.js";

const playInput = document.getElementById("playInput");
const playOutput = document.getElementById("playOutput");
const playError = document.getElementById("playError");
const playIndentStyle = document.getElementById("playIndentStyle");
const playIndentWidth = document.getElementById("playIndentWidth");
const playBraceStyle = document.getElementById("playBraceStyle");
const playMaxBlankLines = document.getElementById("playMaxBlankLines");
const playPreserveComments = document.getElementById("playPreserveComments");

let lastGoodOutput = "";
let debounceTimer;
let wasmReady = false;

function getOptions() {
    return {
        indentStyle: playIndentStyle.value,
        indentWidth: Number(playIndentWidth.value) || 4,
        braceStyle: playBraceStyle.value,
        maxBlankLines: Number(playMaxBlankLines.value) || 0,
        trailingNewline: true,
        preserveInlineComments: playPreserveComments.checked,
    };
}

function showError(message) {
    playError.textContent = message;
    playError.hidden = false;
    playOutput.parentElement.classList.add("has-error");
}

function clearError() {
    playError.textContent = "";
    playError.hidden = true;
    playOutput.parentElement.classList.remove("has-error");
}

function runFormat() {
    if (!wasmReady || !playInput || !playOutput) {
        return;
    }

    const input = playInput.value;
    if (!input.trim()) {
        lastGoodOutput = "";
        playOutput.textContent = "";
        clearError();
        return;
    }

    const options = getOptions();

    try {
        const formatted = format(
            input,
            options.indentStyle,
            options.indentWidth,
            options.braceStyle,
            options.maxBlankLines,
            options.trailingNewline,
            options.preserveInlineComments
        );
        lastGoodOutput = formatted;
        playOutput.textContent = formatted;
        clearError();
    } catch (error) {
        if (lastGoodOutput) {
            playOutput.textContent = lastGoodOutput;
        }
        showError(error instanceof Error ? error.message : String(error));
    }
}

function scheduleFormat() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runFormat, 150);
}

function bindPlayground() {
    const controls = [
        playInput,
        playIndentStyle,
        playIndentWidth,
        playBraceStyle,
        playMaxBlankLines,
        playPreserveComments,
    ];

    controls.forEach(function (control) {
        if (!control) {
            return;
        }

        const eventName = control.type === "checkbox" || control.tagName === "SELECT" ? "change" : "input";
        control.addEventListener(eventName, scheduleFormat);
    });

    runFormat();
}

async function boot() {
    if (!playInput || !playOutput) {
        return;
    }

    try {
        await init();
        wasmReady = true;
        bindPlayground();
    } catch (error) {
        showError(
            error instanceof Error
                ? `Failed to load formatter: ${error.message}`
                : "Failed to load formatter."
        );
    }
}

boot();
