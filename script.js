```javascript
document.addEventListener('DOMContentLoaded', () => {
    const greetingElement = document.getElementById('greeting');
    const nameInput = document.getElementById('nameInput');
    const updateButton = document.getElementById('updateButton');

    // Message de bienvenue initial
    const defaultGreeting = "Bonjour, monde !";
    greetingElement.textContent = defaultGreeting;

    // Mise à jour du message de salutation
    function updateGreeting() {
        const name = nameInput.value.trim();
        
        if (name) {
            greetingElement.textContent = `Bonjour, ${name} !`;
            nameInput.value = ''; // Vidage du champ après mise à jour
        }
    }

    // Gestion des événements
    updateButton.addEventListener('click', updateGreeting);

    // Effet au survol du bouton
    updateButton.addEventListener('mouseenter', () => {
        updateButton.style.transform = 'scale(1.05)';
    });

    updateButton.addEventListener('mouseleave', () => {
        updateButton.style.transform = 'scale(1)';
    });
});
```