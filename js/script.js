fetch('js/exercises.json')
    .then(res => res.json())
    .then(data => {
        let keys = Object.keys(data)
        // console.log(keys)

        Object.values(data).forEach(exercise => {
            // Create labels
            let label = document.createElement('label')
            label.setAttribute('for', keys[exercise.id])
            label.innerHTML = `${exercise.name}`

            // Create checkboxes
            let checkbox = document.createElement('input')
            checkbox.type = 'checkbox'
            checkbox.id = keys[exercise.id]
            checkbox.name = 'chosen-exercises'
            checkbox.value = keys[exercise.id]

            // Input into HTML
            document.getElementById('choose-exercise').appendChild(label)
            document.getElementById('choose-exercise').appendChild(checkbox)
        })

        // Disable exercises based on the checbox that is selected
        function checkboxCheck(name, checkedPath) {
            document.getElementById(name).addEventListener('change', function () {
                if (this.checked) {
                    Object.values(data).forEach(exercise => {
                        if (exercise['involves'][checkedPath]) {
                            document.querySelector(`label[for="${keys[exercise.id]}"]`).style.textDecoration = 'line-through'
                            document.getElementById(keys[exercise.id]).disabled = true
                            document.getElementById(keys[exercise.id]).checked = false
                        }
                    })
                } else {
                    Object.values(data).forEach(exercise => {
                        if (exercise['involves'][checkedPath]) {
                            document.querySelector(`label[for="${keys[exercise.id]}"]`).style.textDecoration = 'none'
                            document.getElementById(keys[exercise.id]).disabled = false
                        }
                    })
                }
            })
        }

        // Bodyparts checkboxes
        checkboxCheck('no-arms', 'arms')
        checkboxCheck('no-legs', 'legs')
        checkboxCheck('no-abdomen', 'abdomen')

        // Other checkboxes
        checkboxCheck('no-jumping', 'jumping')
        checkboxCheck('no-equipment', 'equipment')

        // Select all-button
        document.getElementById('select-all').addEventListener('click', e => {
            e.preventDefault()
            let exerciseBoxes = document.querySelectorAll('input[name="chosen-exercises"]')
            exerciseBoxes.forEach(box => {
                if (!box.disabled) {
                    box.checked = true
                }
            })
        })

        // Remove all-button
        document.getElementById('remove-all').addEventListener('click', e => {
            e.preventDefault()
            let exerciseBoxes = document.querySelectorAll('input[name="chosen-exercises"]')
            exerciseBoxes.forEach(box => {
                box.checked = false
            })
        })


        document.getElementById('start-workout').addEventListener('click', e => {
            // Stop page from refreshing by submitting form
            e.preventDefault()

            // Select exercises from JSON file
            let chosenExercises = []
            chosenExercises = document.querySelectorAll('input[name="chosen-exercises"]:checked')
            console.log(chosenExercises)
            
            // Set length of exercise
            let numberOfExercises = chosenExercises.length
            let length = document.getElementById('minutes').value * 60
            let exerciseTimer = Math.floor(length * 0.8675 / numberOfExercises) * 1000
            let restTimer = Math.floor(length * 0.1325 / (numberOfExercises - 1)) * 1000
            console.log(numberOfExercises, length, exerciseTimer, restTimer)

            // Display pause-button
            const pauseButton = document.getElementById('pause-button')
            const playButton = document.getElementById('play-button')
            pauseButton.style.display = 'inline-block'
            pauseButton.setAttribute('aria-hidden', 'false')

            // Timer for testing - will be removed
            // let timer = length
            // let etEllerAnnet = setInterval(function () {
            //     if (timer >= 0) {
            //         document.getElementById('test-timer').innerHTML = timer
            //         timer--
            //     }
            // }, 1000)


            // Displaying exercises on a timer
            let idx = 0
            function nextExercise() {
                let exercise = chosenExercises[idx]
                idx++

                if (idx <= numberOfExercises) {
                    // Setting timers & countdown
                    let exerciseSeconds = exerciseTimer / 1000
                    document.getElementById('countdown').innerHTML = `${exerciseSeconds} seconds`
                    // exerciseSeconds--
                    let countdown = setInterval(function () {
                        exerciseSeconds--
                        if (exerciseSeconds >= 0) {
                            document.getElementById('countdown').innerHTML = `${exerciseSeconds} seconds`
                            console.log(idx, exerciseSeconds)
                        }
                    }, 1000)
                    let exerciseCountdown = setTimeout(nextExercise, exerciseTimer)

                    // Change HTML
                    document.getElementById('exercise-header').innerHTML = exercise.name
                    document.getElementById('exercise-image').src = `resources / ${exercise.path} `
                    document.getElementById('exercise-image').alt = `${exercise.alt} `

                    // Pause / continue workout
                    pauseButton.addEventListener('click', e => {
                        clearTimeout(exerciseCountdown)
                        clearInterval(countdown)

                        // Buttons
                        pauseButton.style.display = 'none'
                        pauseButton.setAttribute('aria-hidden', 'true')
                        playButton.style.display = 'inline-block'
                        playButton.setAttribute('aria-hidden', 'false')
                    })
                    playButton.addEventListener('click', e => {
                        exerciseCountdown = setTimeout(nextExercise, exerciseSeconds * 1000)
                        countdown = setInterval(function () {
                            exerciseSeconds--
                            if (exerciseSeconds >= 0) {
                                document.getElementById('countdown').innerHTML = `${exerciseSeconds} seconds`
                                // exerciseSeconds--
                            }
                        }, 1000)

                        // Buttons
                        playButton.style.display = 'none'
                        playButton.setAttribute('aria-hidden', 'true')
                        pauseButton.style.display = 'inline-block'
                        pauseButton.setAttribute('aria-hidden', 'false')
                    })
                }
            }
            nextExercise()

        })
    })
