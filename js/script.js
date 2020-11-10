fetch('js/exercises.json')
    .then(res => res.json())
    .then(data => {
        document.getElementById('start-workout').addEventListener('click', e => {
            // Stop page from refreshing by submitting form
            e.preventDefault();

            // Find chosen "excluded options"
            let exclude = [];
            exclude['bodypart'] = document.getElementById('bodypart-exclusion').value;
            let checkboxes = document.querySelectorAll('input[name="checkbox"]:checked');
            checkboxes.forEach(checked => {
                exclude[checked.value] = true;
            });
            // console.log(exclude);

            // Select exercises from JSON file
            // console.log(data);
            let chosenExercises = [];
            Object.values(data).forEach(exercise => {
                // Exclude bodyparts, jumping & equipment if chosen
                if (!(exclude['no-jump'] && exercise.jumping) && !(exclude['no-equip'] && exercise.equipment) && (exclude['bodypart'] != exercise.bodypart)) {
                    chosenExercises.push(exercise);
                }
            })
            console.log(chosenExercises);

            // Set length
            let numberOfExercises = chosenExercises.length;
            let length = document.getElementById('minutes').value * 60;
            let exerciseTimer = Math.floor(length * 0.8675 / numberOfExercises);
            let restTimer = Math.floor(length * 0.1325 / (numberOfExercises - 1));
            console.log(numberOfExercises, length, exerciseTimer, restTimer);
        })
    })