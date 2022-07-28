let page = 1

const postsContainer = document.querySelector("#posts-container")
const loaderContainer = document.querySelector(".loader")
const filterInput = document.querySelector("#filter")

/*Função para buscar os posts, 
no qual uma requisição assíncrona é feita e quando obtida a promise, 
o valor será atribuído a response 
*/

const getPosts = async () =>{

    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=5&_page=${page}`)
    
    /*Por conta de ser uma função assíncrona, 
    os resultados serão encapsulados dentro de uma promise*/
    return response.json()
}


const addPostIntoDOM = async () =>{

    //Chamando a getPosts e desencapsulando a promise por meio do await
    const posts = await getPosts()

    //Percorrendo o array existente e criando um novo array diferente
    const postsTemplates = posts.map(({id, title, body}) => `
    <div class="post">
        <div class="number">${id}</div>
        <div class="post-info">
            <h2 class="post-title">${title}</h2>
            <p class="post-body">${body}</p>
        </div>
    </div>
    `).join('') /*Retornando uma nova string com todos os itens do array criado 
    de forma concatenada e sem vírgulas para separar*/

    //Inserindo as divs dentro do HTML
    postsContainer.innerHTML += postsTemplates
}

addPostIntoDOM()

//Fazendo a chamada dos próximos posts e com que apareçam na tela (DOM)
const getNextPosts = () =>{

    setTimeout(() =>{
        
        page++ //Chamando a próxima página (2,3,4,...)
        addPostIntoDOM()

    }, 300)
}
//Fazendo o símbolo de carregar desaparecer no final da página
const removeLoader = () =>{

    setTimeout(() =>{

        loaderContainer.classList.remove('show')
        getNextPosts()
    }, 1000)
}

//Fazendo o símbolo de carregar aparecer no final da página
const showLoader = () =>{

    loaderContainer.classList.add('show')
    removeLoader()
}

//Verificando quantos pixels faltam para a página acabar
window.addEventListener('scroll', () =>{

    const {clientHeight, scrollHeight, scrollTop} = document.documentElement
    const isPageBottomAlmostReached = scrollTop+ clientHeight >= scrollHeight - 10


    if(isPageBottomAlmostReached){

        showLoader()
    }
})


const showPostIfMatchInputValue = inputValue => post => {
 
    //Recebendo os conteúdos do título e do corpo das divs para comparar com o valor do input
    const postTitle = post.querySelector('.post-title').textContent.toLowerCase()
    const postBody = post.querySelector('.post-body').textContent.toLowerCase()
    const postsContainsInputValue = postTitle.includes(inputValue) || 
    postBody.includes(inputValue)
   
    //toLowerCase é para poder usar o includes() sem problemas de Case Sensitive

    //Se os valores de postTitle ou postBody possuirem o mesmo valor que inputValue
    if(postsContainsInputValue){

        post.style.display = 'flex'

        return  //Se o if for executado, o post.style.display = 'none' não será executado
    }

    post.style.display = 'none'

    }

const handleInputValue = event =>{

    const inputValue =  event.target.value.toLowerCase() //forma de descobrir os valores digitados no input
    const posts = document.querySelectorAll('.post')
 
    //Função para executar a consulta várias vezes do valor digitado no input e mostrar na tela
    posts.forEach(showPostIfMatchInputValue(inputValue))
 }

/*Obtendo o valor digitado no campo de pesquisa, por meio do uso do parâmetro evento 
(para entender qual evento ocorreu e pegar mais informações, como o que fora digitado)*/
filterInput.addEventListener('input', handleInputValue)
