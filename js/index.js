document.addEventListener('DOMContentLoaded', () => {
    const monsterContainer = document.getElementById('monster-container');
    const backButton = document.getElementById('back')
    const forwardButton = document.getElementById('forward')
    const formContainer = document.getElementById('create-monster')
    let pageNum = 1

    //create form
    const monsterForm = document.createElement('form')
    monsterForm.innerHTML = `
        <label>Name</label>
        <input type="text" id="monster-name"/>
        <label>Age</label>
        <input type="number" id="monster-age"/>
        <label>Description</label>
        <input type="text" id="monster-description"/>
        <input type="submit" id="monster-submit" value="Create Monster!"></input>
    `
    formContainer.append(monsterForm)

    //append submits to DOM
    formContainer.addEventListener('submit', (event) => {
        event.preventDefault()
    fetch("http://localhost:3000/monsters", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json"
          },
          body:JSON.stringify({
                name: document.getElementById('monster-name').value,
                age: document.getElementById('monster-age').value,
                description: document.getElementById('monster-description').value
            })
        })
        .then(resp => resp.json())
        .then(monsterData => console.log(monsterData))
    })

    //fetch first 50 monsters and append onto DOM
    fetch(`http://localhost:3000/monsters/?_limit=50&_page=${pageNum}`)
    .then(res => res.json())
    .then((monsters) => {
        monsterContainer.innerHTML = `On Page ${ pageNum}`
        monsters.forEach((monster) => {
            monsterContainer.append(renderMonster(monster), document.createElement('hr'))
        })
    })

        //add eventListener to back button
        backButton.addEventListener('click', () => {
            if(pageNum === 1){
                window.alert("No more Monsters back here")
            } else {
                pageNum -= 1
                fetch(`http://localhost:3000/monsters/?_limit=50&_page=${pageNum}`)
                .then(res => res.json())
                .then((monsters) => {
                monsterContainer.innerHTML = `On Page ${pageNum}`
                monsters.forEach((monster) => {
                    monsterContainer.append(renderMonster(monster), document.createElement('hr'))
                    })
                })
            }
        })

        //add event listener to forward button
        forwardButton.addEventListener('click', () => {
            pageNum += 1
            fetch(`http://localhost:3000/monsters/?_limit=50&_page=${pageNum}`)
            .then(res => res.json())
            .then((monsters) => {
                if (monsters.length === 0){
                    pageNum -= 1
                    window.alert("No more Monsters that way")
                } else {
                    monsterContainer.innerHTML = `On Page ${pageNum}`
                    monsters.forEach((monster) => {
                        monsterContainer.append(renderMonster(monster), document.createElement('hr'))
                    })
                }
            })
        })


        //default append 50 monsters to DOM
        function renderMonster(monster) {
            const monsterSpan = document.createElement('span')
            monsterSpan.innerHTML = `
                <h1>Name: ${monster.name}</h1>
                <h4>Age: ${monster.age}</h4>
                <p>Description: ${monster.description}</p>
            `
            monsterSpan.dataset.id = monster.id
//alternative to dataset monsterSpan.setAttribute("data-id", monster.id)
            monsterSpan.style.color = "firebrick"
            return monsterSpan
        }
    
}) //DOMContentLoaded end
    
    