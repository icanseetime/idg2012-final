// Disable exercises based on the checbox that is selected
function checkboxCheck(name, checkedPath) {
    document.getElementById(name).addEventListener('change', function () {
        if (this.checked) {
            Object.values(data).forEach(exercise => {
                if (checkedPath) {
                    document.querySelector(`label[for="${keys[exercise.id]}"]`).style.textDecoration = 'line-through'
                    document.getElementById(keys[exercise.id]).disabled = true
                }
            })
        } else {
            Object.values(data).forEach(exercise => {
                if (checkedPath) {
                    document.querySelector(`label[for="${keys[exercise.id]}"]`).style.textDecoration = 'none'
                    document.getElementById(keys[exercise.id]).disabled = false
                }
            })
        }
    })
}