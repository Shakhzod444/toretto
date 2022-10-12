import { useHTTP } from './modules/useHTTP.js'
let row1 = document.querySelector('.row1')
let row2 = document.querySelector('.row2')
let row3 = document.querySelector('.row3')
let form = document.forms.form
let { request } = useHTTP()
function fetchUsers() {
    axios.get('http://localhost:3001/users')
        .then(res => {
            localStorage.setItem('arr', JSON.stringify(res.data))
            reload(res.data)
        })
}
fetchUsers()

const createItem = (item) => {
    return (`
            <div class="box" id="${item.id}" >
                <div class="imgBlock">
                    <p class="name">${item.firstName}</p>
                    <img src="${item.image}" alt="" class="img">
                </div>
                <div class="ageBlock">
                    <p class="ages">age</p>
                    <p class="age">${item.age}</p>
                </div>
                <button class="del" >delete</button>
                <button class="rem" >rem</button>
            </div>
    `)
}

let arr = JSON.parse(localStorage.getItem('arr')) || []
const reload = (arr) => {
    row1.innerHTML = ""
    row2.innerHTML = ""
    row3.innerHTML = ""

    for (let item of arr) {
        if (item.age < 25) {
            row1.innerHTML += createItem(item)
        } else if (item.age < 50) {
            row2.innerHTML += createItem(item)
        } else {
            row3.innerHTML += createItem(item)
        }
    }

    let delBTNS = document.querySelectorAll('.del')
    delBTNS.forEach(btn => {
        btn.onclick = (event) => {
            let id = event.target.parentNode.id

            request("/users/" + id, "delete")
                .then(res => console.log(res))

                fetchUsers()
        }
    })

    let rem = document.querySelectorAll('.rem')
    rem.forEach((btn) => {
        btn.onclick = (event) => {
            let id = event.target.parentNode.id
            let data = arr.find(i => i.id === +id)
            data.firstName = 'Toretto'
            axios.patch(`http://localhost:3001/users/${id}`, data)
                .then((res) => {
                    if (res.status === 200 || res.status === 201) {
                        fetchUsers()
                    }
                })
        }

    })


}
// console.log(box);

const postUser = (data) => {
    axios.post('http://localhost:3001/users', data)
        .then(res => {
            if(res.status === 200 || res.status === 201){
                fetchUsers()
            }
        })

} 



form.onsubmit = (event) => {
    event.preventDefault()

    let arr = {
        id: Math.random(),
        image: 'https://robohash.org/aliquamcumqueiure.png',
    }

    let fm = new FormData(form)

    fm.forEach((value, key) => {
        arr[key] = value
    })

    postUser(arr)
}