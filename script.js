let currentLang = 'en';

const translations = {
    en: {
        title: "Taleemi Wazaif Checker",
        agePlaceholder: "Enter your age (e.g. 19)",
        classOption: "Class",
        checkBtn: "Check Eligibility",
        resetBtn: "Reset",
        errorEmpty: "Please enter age",
        errorInvalidAge: "Please enter a valid age",
        notEligible: "Not Eligible",
        eligiblePattern: "Congratulations, you are eligible for taleemi wazaif\nEligibility level: {level} Level"
    },
    ur: {
        title: "تعلیمی وظائف چیکر",
        agePlaceholder: "عمر (مثلاً 19)",
        classOption: "کلاس",
        checkBtn: "اہلیت چیک کریں",
        resetBtn: "ری سیٹ",
        errorEmpty: "براہ کرم عمر درج کریں",
        errorInvalidAge: "براہ کرم درست عمر درج کریں",
        notEligible: "اہل نہیں",
        eligiblePattern: "مبارک ہو، آپ تعلیمی وظائف کے لیے اہل ہیں۔\nاہلیت کی سطح: {level}"
    }
};

const levels = {
    en: {
        primary: "Primary",
        secondary: "Secondary",
        higherSecondary: "Higher Secondary"
    },
    ur: {
        primary: "پرائمری",
        secondary: "سیکنڈری",
        higherSecondary: "ہائیر سیکنڈری"
    }
};

document.addEventListener("DOMContentLoaded", () => {
    populateClasses();
    updateUI();
});

function populateClasses() {
    const select = document.getElementById("class-level");
    select.innerHTML = "";
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = `${translations[currentLang].classOption} ${i}`;
        select.appendChild(option);
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ur' : 'en';
    const container = document.getElementById('taleemi-wrapper') || document.querySelector('.app-container');
    if (container) {
        container.dir = currentLang === 'ur' ? 'rtl' : 'ltr';
    }
    
    // Save current selected class so it doesn't reset to 1
    const currentClass = document.getElementById("class-level").value;
    updateUI();
    document.getElementById("class-level").value = currentClass || 1;
    
    // Auto re-check if result is previously visible
    const resultContainer = document.getElementById("result-container");
    if (!resultContainer.classList.contains("hidden")) {
        handleCheck(); 
    }
}

function updateUI() {
    const t = translations[currentLang];
    document.getElementById("app-title").textContent = t.title;
    document.getElementById("age").placeholder = t.agePlaceholder;
    
    document.getElementById("check-btn").textContent = t.checkBtn;
    document.getElementById("reset-text").textContent = t.resetBtn;
    
    populateClasses();
}

function handleCheck() {
    const ageInput = document.getElementById("age").value;
    const classVal = parseInt(document.getElementById("class-level").value);
    const resultContainer = document.getElementById("result-container");
    const resultMsg = document.getElementById("result-msg");
    const resultIcon = document.getElementById("result-icon");
    const t = translations[currentLang];

    if (!ageInput) {
        showError(t.errorEmpty);
        return;
    }

    const age = parseInt(ageInput);
    if (isNaN(age) || age <= 0) {
        showError(t.errorInvalidAge);
        return;
    }

    let levelKey = null;

    if (classVal >= 1 && classVal <= 5) {
        if (age >= 4 && age <= 12) levelKey = "primary";
    } else if (classVal >= 6 && classVal <= 10) {
        if (age >= 8 && age <= 18) levelKey = "secondary";
    } else if (classVal >= 11 && classVal <= 12) {
        if (age >= 13 && age <= 22) levelKey = "higherSecondary";
    }

    resultContainer.classList.remove("hidden", "error", "success");
    
    if (levelKey) {
        const levelName = levels[currentLang][levelKey];
        const msg = t.eligiblePattern.replace("{level}", levelName);
        resultContainer.classList.add("success");
        resultIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
        resultMsg.innerText = msg; // Using innerText to respect \n newline
    } else {
        resultContainer.classList.add("error");
        resultIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
        resultMsg.innerText = t.notEligible;
    }
}

function showError(msg) {
    const resultContainer = document.getElementById("result-container");
    const resultMsg = document.getElementById("result-msg");
    const resultIcon = document.getElementById("result-icon");
    
    resultContainer.classList.remove("hidden", "success");
    resultContainer.classList.add("error");
    resultIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    resultMsg.innerText = msg;
}

function handleReset() {
    document.getElementById("age").value = "";
    document.getElementById("class-level").value = 1;
    const resultContainer = document.getElementById("result-container");
    resultContainer.classList.add("hidden");
    resultContainer.classList.remove("error", "success");
}
