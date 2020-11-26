fetch('js/exercises.json')
    .then(res => res.json())
    .then(data => {
        let keys = Object.keys(data)
        // console.log("Keys: ", keys)

        // Set sections of page
        let exerciseChoicesSection = document.getElementById('exercise-choices')
        let workoutSection = document.getElementById('workout')

        // Add checkboxes etc to form from JSON-data
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

        // Start workout-button
        document.getElementById('start-workout').addEventListener('click', e => {
            // Stop page from refreshing by submitting form
            e.preventDefault()

            // Select exercises from JSON file
            let chosenExercises = []
            chosen = document.querySelectorAll('input[name="chosen-exercises"]:checked')
            // console.log("Chosen inputs: ", chosen)
            chosen.forEach(ex => {
                chosenExercises.push(ex.value)
            })
            // console.log("Chosen exercises:", chosenExercises)

            // Set length of exercise
            let numberOfExercises = chosenExercises.length
            let length = document.getElementById('minutes').value * 60
            let exerciseTimer = Math.floor(length * 0.8675 / numberOfExercises) * 1000
            let restTimer = Math.floor(length * 0.1325 / (numberOfExercises - 1)) * 1000
            console.table("Number of exercises:", numberOfExercises, "Total length:", length, "Length of exercise:", exerciseTimer, "Length of break:", restTimer)

            // Display pause-button
            const pauseButton = document.getElementById('pause-button')
            const playButton = document.getElementById('play-button')
            pauseButton.style.display = 'inline-block'
            pauseButton.setAttribute('aria-hidden', 'false')


            console.log(chosenExercises)

            if (chosenExercises.length <= 2) {
                //Display error message
                document.getElementById('exercise-header').innerHTML = "You have to choose at least three exercises. Please try again."
            } else {
                // Hide form
                exerciseChoicesSection.style.display = 'none'
                runThroughExercises(chosenExercises, exerciseTimer, restTimer)
            }

            // Run through all the exercises
            // Displaying exercises on a timer
            function runThroughExercises(exercises, lengthOfExercise, lengthOfBreak) {
                let workout = []
                // Go through all chosen exercises
                exercises.forEach(exercise => {
                    // Put corresponding objects and all breaks into array
                    Object.values(data).forEach(ex => {
                        if (exercise == keys[ex.id]) {
                            workout.push(ex)
                            workout.push('break')
                        }
                    })
                })
                // Remove break at the end
                workout.pop()
                console.log(workout)
                // Set timers
                timeWorkout(workout, lengthOfExercise, lengthOfBreak)
            }

            function timeWorkout(workout, lengthOfExercise, lengthOfBreak) {
                let total = lengthOfExercise
                let currentExercise
                let idx = 0

                console.log(workout)
                workout.forEach(instance => {
                    total += 1000
                    if (typeof (instance) == 'object') {
                        // Save current exercise
                        if (workout[idx + 2]) currentExercise = workout[idx + 2]
                        if (instance == workout[0]) {
                            // First exercise - for immediate start
                            displayExercise(instance, lengthOfExercise)
                            setTimeout(displayBreak, total, lengthOfBreak)
                        } else if (instance == workout[workout.length - 1]) {
                            // Set timeout for finish-line 
                            setTimeout(endOfExercises, total + 1000)
                        } else {
                            // Set timeout for next break and add time to counter
                            setTimeout(displayBreak, total + 1000, lengthOfBreak)
                        }
                        total += lengthOfBreak
                        idx++
                    } else if (typeof (instance) == 'string') {
                        // Set timeout for next exercise and add time to counter
                        setTimeout(displayExercise, total + 1000, currentExercise, lengthOfExercise)
                        total += lengthOfExercise
                        idx++
                    }
                })
            }

            // Setting the countdown timer
            function countdownTimer(length) {
                // Setting timers & countdown
                let exerciseSeconds = (length / 1000)
                document.getElementById('countdown').innerHTML = `${Math.round(exerciseSeconds)} seconds`
                let countdown = setInterval(function () {
                    exerciseSeconds--
                    if (exerciseSeconds >= 0) {
                        document.getElementById('countdown').innerHTML = `${Math.round(exerciseSeconds)} seconds`
                        // console.log(exerciseSeconds)
                    }
                }, 1000)
            }

            // Displays the exercise
            function displayExercise(currentExercise, lengthOfExercise) {
                console.log("Exercise", currentExercise, lengthOfExercise / 1000)
                document.getElementById('exercise-header').innerHTML = `${currentExercise.name}`
                document.getElementById('exercise-image').src = `resources/${currentExercise.path}`
                document.getElementById('exercise-image').alt = `${currentExercise.alt}`
                document.getElementById('exercise-image').style.transform = "scaleX(1)"

                if (currentExercise.time == 'split') {
                    lengthOfExercise = lengthOfExercise / 2
                    countdownTimer(lengthOfExercise)
                    setTimeout(countdownTimer, lengthOfExercise, lengthOfExercise)
                    setTimeout(() => {
                        document.getElementById('exercise-image').style.transform = "scaleX(-1)"
                    }, lengthOfExercise)
                } else {
                    countdownTimer(lengthOfExercise)
                }
            }

            // Displays the breaks
            function displayBreak(lengthOfBreak) {
                // console.log("Break", lengthOfBreak / 1000)
                countdownTimer(lengthOfBreak)
                document.getElementById('exercise-header').innerHTML = "Take a break"
                document.getElementById('exercise-image').src = ""
                document.getElementById('exercise-image').alt = ""
            }

            // Displays that you have finished the exercise
            function endOfExercises() {
                document.getElementById('exercise-header').innerHTML = "Finished!"
                document.getElementById('exercise-image').src = ""
                document.getElementById('exercise-image').alt = ""
                document.getElementById('countdown').innerText = ""
            }



            // OLD FUNCTION - NOT IN USE -- JUST FOR REFERENCE
            // function nextExercise() {
            //     // let exercise = chosenExercises[idx]
            //     idx++
            //     if (idx <= numberOfExercises) {

            //         // Pause / continue workout
            //         pauseButton.addEventListener('click', e => {
            //             clearTimeout(exerciseCountdown)
            //             clearInterval(countdown)

            //             // Buttons
            //             pauseButton.style.display = 'none'
            //             pauseButton.setAttribute('aria-hidden', 'true')
            //             playButton.style.display = 'inline-block'
            //             playButton.setAttribute('aria-hidden', 'false')
            //         })
            //         playButton.addEventListener('click', e => {

            //             // Buttons
            //             playButton.style.display = 'none'
            //             playButton.setAttribute('aria-hidden', 'true')
            //             pauseButton.style.display = 'inline-block'
            //             pauseButton.setAttribute('aria-hidden', 'false')
            //         })
            //     }
            // }
            // // nextExercise()

        })
    })
