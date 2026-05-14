const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";

const keyInput = document.getElementById("key");
const messageInput = document.getElementById("message");

const resultDiv = document.getElementById("result");
const preparedDiv = document.getElementById("preparedText");
const matrixDiv = document.getElementById("matrix");

const encryptBtn = document.getElementById("encryptBtn");
const decryptBtn = document.getElementById("decryptBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");



function generateMatrix(key) {

  key = key
    .toUpperCase()
    .replace(/J/g, "I")
    .replace(/[^A-Z]/g, "");

  let matrixString = "";

  for (let char of key) {

    if (!matrixString.includes(char)) {
      matrixString += char;
    }
  }

  for (let char of alphabet) {

    if (!matrixString.includes(char)) {
      matrixString += char;
    }
  }

  let matrix = [];

  for (let i = 0; i < 5; i++) {

    matrix.push(
      matrixString.slice(i * 5, i * 5 + 5).split("")
    );
  }

  displayMatrix(matrix);

  return matrix;
}



function displayMatrix(matrix) {

  matrixDiv.innerHTML = "";

  matrix.flat().forEach(letter => {

    const cell = document.createElement("div");

    cell.classList.add("cell");

    cell.textContent = letter;

    matrixDiv.appendChild(cell);
  });
}



function prepareText(text, encrypt = true) {

  text = text
    .toUpperCase()
    .replace(/J/g, "I")
    .replace(/[^A-Z]/g, "");

  let prepared = "";

  if (encrypt) {

    let i = 0;

    while (i < text.length) {

      let first = text[i];
      let second = text[i + 1];

      if (first === second) {

        prepared += first + "X";
        i++;

      } else {

        prepared += first;

        if (second) {

          prepared += second;
          i += 2;

        } else {

          i++;
        }
      }
    }

    if (prepared.length % 2 !== 0) {

      prepared += "X";
    }

  } else {

    prepared = text;

    if (prepared.length % 2 !== 0) {

      prepared += "X";
    }
  }

  return prepared;
}



function findPosition(matrix, char) {

  for (let row = 0; row < 5; row++) {

    for (let col = 0; col < 5; col++) {

      if (matrix[row][col] === char) {

        return [row, col];
      }
    }
  }
}



function encryptPlayfair(text, matrix) {

  let encrypted = "";

  for (let i = 0; i < text.length; i += 2) {

    let a = text[i];
    let b = text[i + 1];

    let [row1, col1] = findPosition(matrix, a);
    let [row2, col2] = findPosition(matrix, b);

    // Same Row
    if (row1 === row2) {

      encrypted += matrix[row1][(col1 + 1) % 5];
      encrypted += matrix[row2][(col2 + 1) % 5];

    }

    // Same Column
    else if (col1 === col2) {

      encrypted += matrix[(row1 + 1) % 5][col1];
      encrypted += matrix[(row2 + 1) % 5][col2];

    }

    // Rectangle Rule
    else {

      encrypted += matrix[row1][col2];
      encrypted += matrix[row2][col1];
    }
  }

  return encrypted;
}



function decryptPlayfair(text, matrix) {

  let decrypted = "";

  for (let i = 0; i < text.length; i += 2) {

    let a = text[i];
    let b = text[i + 1];

    let [row1, col1] = findPosition(matrix, a);
    let [row2, col2] = findPosition(matrix, b);

    // Same Row
    if (row1 === row2) {

      decrypted += matrix[row1][(col1 + 4) % 5];
      decrypted += matrix[row2][(col2 + 4) % 5];

    }

    // Same Column
    else if (col1 === col2) {

      decrypted += matrix[(row1 + 4) % 5][col1];
      decrypted += matrix[(row2 + 4) % 5][col2];

    }

    // Rectangle Rule
    else {

      decrypted += matrix[row1][col2];
      decrypted += matrix[row2][col1];
    }
  }

  return decrypted;
}



function removeExtraX(text) {

  let cleaned = "";

  for (let i = 0; i < text.length; i++) {

    if (
      i > 0 &&
      i < text.length - 1 &&
      text[i] === "X" &&
      text[i - 1] === text[i + 1]
    ) {

      continue;
    }

    cleaned += text[i];
  }

  // Remove ending X if added automatically
  if (cleaned.endsWith("X")) {

    cleaned = cleaned.slice(0, -1);
  }

  return cleaned;
}



encryptBtn.addEventListener("click", () => {

  const key = keyInput.value.trim();
  const message = messageInput.value.trim();

  if (!key || !message) {

    alert("Please enter both keyword and message.");
    return;
  }

  const matrix = generateMatrix(key);

  const prepared = prepareText(message, true);

  preparedDiv.textContent = prepared;

  const encrypted = encryptPlayfair(prepared, matrix);

  resultDiv.textContent = encrypted;
});



decryptBtn.addEventListener("click", () => {

  const key = keyInput.value.trim();
  const message = messageInput.value.trim();

  if (!key || !message) {

    alert("Please enter both keyword and message.");
    return;
  }

  const matrix = generateMatrix(key);

  const prepared = prepareText(message, false);

  preparedDiv.textContent = prepared;

  const decrypted = decryptPlayfair(prepared, matrix);

  const cleanedText = removeExtraX(decrypted);

  resultDiv.textContent = cleanedText;
});



clearBtn.addEventListener("click", () => {

  keyInput.value = "";
  messageInput.value = "";

  resultDiv.textContent = "";
  preparedDiv.textContent = "";

  matrixDiv.innerHTML = "";
});



copyBtn.addEventListener("click", async () => {

  const text = resultDiv.textContent;

  if (!text) {

    alert("Nothing to copy.");
    return;
  }

  await navigator.clipboard.writeText(text);

  copyBtn.textContent = "Copied!";

  setTimeout(() => {

    copyBtn.textContent = "Copy Result";

  }, 2000);
});