fetch('js/exercises.json')
    .then(res => res.json())
    .then(data => {
        let keys = Object.keys(data)

        // Set sections of page
        let exerciseChoicesSection = document.getElementById('exercise-choices')
        let workoutSection = document.getElementById('workout')
        let aboutSection = document.getElementById('about')
        let viewPreviousSection = document.getElementById('view-previous')

        // "Home" link / 7-minute workout header
        document.getElementById('home').addEventListener('click', e => {
            // Hide / display chosen section
            e.preventDefault()
            aboutSection.style.display = "none"
            exerciseChoicesSection.style.display = "block"
            workoutSection.style.display = "none"
            viewPreviousSection.style.display = "none"
        })

        // SECTION || CHOOSE YOUR WORKOUT
        {
            document.getElementById('exercise-choices-link').addEventListener('click', e => {
                // Hide / display chosen section
                e.preventDefault()
                aboutSection.style.display = "none"
                exerciseChoicesSection.style.display = "block"
                workoutSection.style.display = "none"
                viewPreviousSection.style.display = "none"
            })

            // DEFAULT STATE
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
                checkbox.checked = true

                // Input into HTML
                document.getElementById('choose-exercise').appendChild(checkbox)
                document.getElementById('choose-exercise').appendChild(label)
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

                // Pull chosen exercises from JSON file
                let chosenExercises = []
                chosen = document.querySelectorAll('input[name="chosen-exercises"]:checked')
                chosen.forEach(ex => {
                    chosenExercises.push(ex.value)
                })

                // Set length of exercise
                let numberOfExercises = chosenExercises.length
                let length = document.getElementById('minutes').value * 60
                let exerciseTimer = Math.floor(length * 0.8675 / numberOfExercises) * 1000
                let restTimer = Math.floor(length * 0.1325 / (numberOfExercises - 1)) * 1000

                // Hide "Save workout" and "Finish workout"-buttons
                if (document.getElementById('save-button') || document.getElementById('finish-button')) {
                    document.getElementById('workout').removeChild(document.getElementById('save-button'))
                    document.getElementById('workout').removeChild(document.getElementById('finish-button'))
                }

                // Create and display pause-button
                if (!document.getElementById('pause-button')) {
                    const pauseButton = document.createElement('button')
                    pauseButton.id = "pause-button"
                    pauseButton.innerHTML = "Pause workout"
                    document.getElementById('workout').insertBefore(pauseButton, document.getElementById('countdown'))
                }

                // Set a minimum of 3 exercises
                if (chosenExercises.length <= 2) {
                    if (document.querySelector('section#exercise-choices p')) {
                        // Remove previous error message
                        document.getElementById('exercise-choices').removeChild(document.querySelector('p'))
                    }
                    //Display error message
                    let errorMessage = document.createElement('p')
                    errorMessage.innerHTML = "You have to choose at least three exercises. Please try again."
                    errorMessage.setAttribute('role', 'alert')
                    exerciseChoicesSection.appendChild(errorMessage)
                } else {
                    // Hide form
                    exerciseChoicesSection.style.display = "none"
                    workoutSection.style.display = "block"
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
                    // Set timers
                    timeWorkout(workout, lengthOfExercise, lengthOfBreak)
                }

                function timeWorkout(workout, lengthOfExercise, lengthOfBreak) {
                    let total = lengthOfExercise
                    let currentExercise
                    let idx = 0

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

                // Pause/continue-button -- work in progress
                let timesClicked = 0
                document.getElementById('pause-button' || 'play-button').addEventListener('click', e => {
                    let pauseButton = document.getElementById('pause-button')
                    timesClicked++
                    // Continue workout
                    if (timesClicked % 2 == 0) {
                        pauseButton.innerHTML = "Pause workout"
                    } else { // Pause workout
                        pauseButton.innerHTML = "Continue workout"
                        sessionStorage.setItem('seconds', sessionStorage.getItem('timer'))
                        // exTimer.forEach(timer => {
                        //     clearTimeout(timer)
                        // })
                        // breakTimer.forEach(timer => {
                        //     clearTimeout(timer)
                        // })
                        // endTimer.forEach(timer => {
                        //     clearTimeout(timer)
                        // })
                    }
                })

                // Setting the countdown timer
                function countdownTimer(length) {
                    // Setting timers & countdown
                    let exerciseSeconds = (length / 1000)
                    document.getElementById('countdown').innerHTML = `${Math.round(exerciseSeconds)} second(s)`
                    let countdown = setInterval(function () {
                        exerciseSeconds--
                        if (exerciseSeconds >= 0) {
                            document.getElementById('countdown').innerHTML = `${Math.round(exerciseSeconds)} second(s)`
                            sessionStorage.setItem('timer', exerciseSeconds)
                        }
                    }, 1000)
                }

                // Exercises
                function displayExercise(currentExercise, lengthOfExercise) {
                    // Make screen readers read out name of exercise and the number of seconds
                    let seconds = lengthOfExercise / 1000
                    document.getElementById('exercise-header').setAttribute('aria-label', `${currentExercise.name}, ${seconds} seconds`)

                    // Display relevant information in the workout section
                    document.getElementById('exercise-header').innerHTML = `${currentExercise.name}`
                    document.getElementById('exercise-image').src = `resources/${currentExercise.path}`
                    document.getElementById('exercise-image').alt = `${currentExercise.alt}`
                    document.getElementById('exercise-image').style.transform = "scaleX(1)"

                    // Split time for certain exercises
                    if (currentExercise.time == 'split') {
                        lengthOfExercise = lengthOfExercise / 2
                        countdownTimer(lengthOfExercise)
                        setTimeout(countdownTimer, lengthOfExercise, lengthOfExercise)
                        setTimeout(() => {
                            // Flip image and display message to switch sides
                            document.getElementById('exercise-image').style.transform = "scaleX(-1)"
                            document.getElementById('switch-sides').innerHTML = "Switch sides"
                        }, lengthOfExercise)
                    } else {
                        countdownTimer(lengthOfExercise)
                    }
                }

                // Breaks between exercises
                function displayBreak(lengthOfBreak) {
                    countdownTimer(lengthOfBreak)
                    // Make screen readers read out "Take a break" and the number of seconds
                    let seconds = lengthOfBreak / 1000
                    document.getElementById('exercise-header').setAttribute('aria-label', `Take a break, ${seconds} seconds`)

                    // Display relevant information in the workout section
                    document.getElementById('exercise-header').innerHTML = "Take a break"
                    document.getElementById('exercise-image').src = ""
                    document.getElementById('exercise-image').alt = ""
                    document.getElementById('switch-sides').innerHTML = ""
                }

                // Finish-line
                function endOfExercises() {
                    // Display relevant information in the workout section
                    document.getElementById('exercise-header').innerHTML = "Finished!"
                    document.getElementById('exercise-image').src = ""
                    document.getElementById('exercise-image').alt = ""
                    document.getElementById('countdown').innerText = ""
                    document.getElementById('switch-sides').innerHTML = ""

                    // Hide pause/continue-workout button
                    document.getElementById('workout').removeChild(document.getElementById('pause-button'))

                    // Save workout- button
                    let saveButton = document.createElement('button')
                    saveButton.id = "save-button"
                    saveButton.innerHTML = "Save workout"
                    document.getElementById('workout').appendChild(saveButton)

                    // Finish workout-button
                    let finishButton = document.createElement('button')
                    finishButton.id = "finish-button"
                    finishButton.innerHTML = "Finish workout"
                    document.getElementById('workout').appendChild(finishButton)
                }
            })
        }

        // SECTION || READ ABOUT EXERCISES
        document.getElementById('about-link').addEventListener('click', e => {
            // Hide / display chosen section
            e.preventDefault()
            aboutSection.style.display = "block"
            exerciseChoicesSection.style.display = "none"
            workoutSection.style.display = "none"
            viewPreviousSection.style.display = "none"

            // Create overview-section
            if (!document.querySelector('#overview-section')) {
                let overviewSection = document.createElement('section')
                overviewSection.id = "overview-section"

                let ul = document.createElement('ul')
                Object.values(data).forEach(exercise => {
                    //List items
                    let li = document.createElement('li')
                    let a = document.createElement('a')
                    a.href = ""
                    a.setAttribute('aria-label', `Read about ${exercise.name}`)
                    a.id = `read-${keys[exercise.id]}`

                    // Headings
                    heading = document.createElement('h3')
                    heading.innerHTML = exercise.name
                    a.appendChild(heading)

                    // Illustrations
                    illustration = document.createElement('img')
                    illustration.src = `resources/${exercise.path}`
                    illustration.role = "presentational"
                    illustration.alt = exercise.alt
                    a.appendChild(illustration)

                    a.addEventListener('click', e => {
                        e.preventDefault()
                        // Hide overview-section
                        overviewSection.style.display = "none"

                        // Create info-section
                        let infoSection = document.createElement('section')
                        infoSection.id = "info-section"

                        // Create header
                        let h3 = document.createElement('h3')
                        h3.innerHTML = exercise.name
                        infoSection.appendChild(h3)

                        // Create illustration
                        let img = document.createElement('img')
                        img.src = `resources/${exercise.path}`
                        img.alt = exercise.alt
                        infoSection.appendChild(img)

                        // Create paragraphs that show the steps
                        Object.values(exercise.steps).forEach((step, idx) => {
                            let h4 = document.createElement('h4')
                            h4.innerHTML = `Step ${idx + 1}`
                            infoSection.appendChild(h4)
                            let p = document.createElement('p')
                            p.innerHTML = `${step}`
                            infoSection.appendChild(p)
                        })

                        // Create back-button
                        let button = document.createElement('button')
                        button.innerHTML = "Go back"
                        button.addEventListener('click', e => {
                            document.getElementById('about').removeChild(document.getElementById('info-section'))
                            overviewSection.style.display = "block"
                        })
                        infoSection.appendChild(button)

                        // Display everything in the about-section
                        aboutSection.appendChild(infoSection)
                    })
                    // Connect list items
                    li.appendChild(a)
                    ul.appendChild(li)
                })
                // Append list to browser view
                overviewSection.appendChild(ul)
                aboutSection.appendChild(overviewSection)
            }

        })

        // SECTION || VIEW PREVIOUS WORKOUTS
        document.getElementById('view-previous-link').addEventListener('click', e => {
            // Hide / display chosen section
            e.preventDefault()
            aboutSection.style.display = "none"
            exerciseChoicesSection.style.display = "none"
            workoutSection.style.display = "none"
            viewPreviousSection.style.display = "block"
        })

    })
