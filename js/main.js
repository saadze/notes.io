document.getElementById("validation-button").onclick = ()=>{
    addToList();
};
var num = 0
function showHideTextBar(){
    let textarea = document.getElementById('text-writer');
    if (textarea.style.display == "none"){
        textarea.style.display = "block"
    }else{
        textarea.style.display = "none";
    }
}
function addToList() {
    let text = document.getElementById("message").value ;
    if (text.length > 0) {
        let list = document.getElementById("result-list") ;
        /*creating a div */
        let div = document.createElement("div");
        div.setAttribute("class","ToDo");
        div.setAttribute("id","item"+num);
        let icon = document.createElement("img");
        icon.src = "assets/icons/cross.svg";
        icon.setAttribute("id","item"+num);
        icon.setAttribute("class","remove");
        num += 1;
        /*creating the list item*/
        let textNode = document.createTextNode(text);
        let item = document.createElement("p");
        item.innerText= text;
        div.appendChild(item);
        div.appendChild(icon)
        list.appendChild(div);
    };
};

document.addEventListener('click', (event) => {

	// If the clicked element doesn't have the right selector, bail
	if (!event.target.matches('.remove')) return;

    let element= event.target;
    let parent = element.parentNode;
    parent.parentNode.removeChild(parent);

}, false);

