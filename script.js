const database = firebase.database();

const medListElement = document.getElementById('med-list');
const medNameInput = document.getElementById('med-name');
const medTimeInput = document.getElementById('med-time');
let editingKey = null;

function addOrUpdateMedication() {
    const name = medNameInput.value.trim();
    const time = medTimeInput.value.trim();
    if (name === '' || time === '') {
        alert('Please enter both name and time for the medication');
        return;
    }

    if (editingKey) {
        database.ref('medications/' + editingKey).update({
            name: name,
            time: time
        });
    } else {
        database.ref('medications').push({
            name: name,
            time: time
        });
    }
    medNameInput.value = '';
    medTimeInput.value = '';
    editingKey = null;
}

function editMedication(key, name, time) {
    medNameInput.value = name;
    medTimeInput.value = time;
    editingKey = key;
}

function deleteMedication(key) {
    database.ref('medications/' + key).remove();
}

database.ref('medications').on('value', (snapshot) => {
    const medications = snapshot.val();
    medListElement.innerHTML = '';
    for (const key in medications) {
        const med = medications[key];
        const liElement = document.createElement('li');
        liElement.textContent = `${med.name} at ${med.time}`;
        const editButton = document.createElement('span');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit');
        editButton.onclick = () => editMedication(key, med.name, med.time);
        const deleteButton = document.createElement('span');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete');
        deleteButton.onclick = () => deleteMedication(key);
        liElement.appendChild(editButton);
        liElement.appendChild(deleteButton);
        medListElement.appendChild(liElement);
    }
});
