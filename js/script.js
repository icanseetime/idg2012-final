fetch('js/exercises.json')
    .then(res => res.json())
    .then(data => {
        document.getElementById('start-workout').addEventListener('click', e => {
            // Stop page from refreshing by submitting form
            e.preventDefault()

            // Find chosen "excluded options"
            let exclude = []
            exclude['bodypart'] = document.getElementById('bodypart-exclusion').value
            let checkboxes = document.querySelectorAll('input[name="checkbox"]:checked')
            checkboxes.forEach(checked => {
                exclude[checked.value] = true
            })

            // Select exercises from JSON file
            let chosenExercises = []
            Object.values(data).forEach(exercise => {
                // Exclude bodyparts, jumping & equipment if chosen
                if (!(exclude['no-jump'] && exercise.jumping) 
                && !(exclude['no-equip'] && exercise.equipment) 
                && (exclude['bodypart'] != exercise.bodypart)) {
                    chosenExercises.push(exercise)
                }
            })
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
                    document.getElementById('exercise-image').src = `resources/${exercise.path}`
                    document.getElementById('exercise-image').alt = `${exercise.alt}`

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
