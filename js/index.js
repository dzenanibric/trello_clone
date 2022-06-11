class Trello {
    create_new_project;
    dashboard;
    project_screen;
    add_task_btn;
    delete_btn;

    constructor(create_new_project, dashboard, project_screen, add_task_btn, delete_btn){
        this.create_new_project = document.getElementById('create-new-project');
        this.dashboard = document.getElementById('dashboard');
        this.project_screen = document.getElementById('project-screen');
        this.add_task_btn = document.getElementById('add-task');
        this.delete_btn = document.getElementById('delete-btn');
    }

    findToken(){
        if(localStorage.getItem('sessionAlive')){
           return true;
        }
        else{
            return false;
        }
    }

    setNewSession(){
        localStorage.setItem('sessionAlive', 'true');
    }

    createNewProject(){
        this.create_new_project.addEventListener('click', ()=>{
            this.dashboard.style.display = 'none';
            this.project_screen.style.display = 'flex';
            this.setNewSession();
            localStorage.removeItem('currentProject');
        });
    }

    addTask(){
        const task_input = document.getElementById('add-todo-text').value;
        const field = document.querySelector('.field');

        const card = document.createElement('div');
        const card_value = document.createElement('p');
        const delete_btn = document.createElement('button');

        card.setAttribute('id', 'card');
        delete_btn.setAttribute('id', 'delete-btn');
        card.setAttribute('draggable', 'true');

        card_value.innerText = task_input;
        delete_btn.innerText = '-';

        delete_btn.addEventListener('click', ()=>{
            card.remove();
        });

        card.appendChild(card_value);
        card.appendChild(delete_btn);
        field.appendChild(card);
    }

    dragAndDrop(){
        const cards = document.querySelectorAll('#card');
        const fields = document.querySelectorAll('.field');

        cards.forEach(card =>  {
            card.addEventListener('dragstart', ()=>{
                card.classList.add('dragging');
            });
            card.addEventListener('dragend', ()=>{
                card.classList.remove('dragging');
            });
        });

        fields.forEach(field => {
            field.addEventListener('dragover', e=>{
                e.preventDefault();
                const afterElement = this.getDragAfterElement(field, e.clientY);
                const draggable  = document.querySelector('.dragging');
                if(afterElement === null){
                    field.appendChild(draggable);
                }
                else{
                    field.insertBefore(draggable, afterElement);
                }
            });
        });
    }

    getDragAfterElement(field, y){
        const draggableElements = [...field.querySelectorAll('#card:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if(offset < 0 && offset > closest.offset){
                return {offset: offset, element: child}
            }
            else{
                return closest;
            }
        }, {offset: Number.NEGATIVE_INFINITY}).element;
    }

    trelloHandler(){
        const task_input = document.getElementById('add-todo-text');
        if(this.findToken() === true){
            this.project_screen.style.display = 'flex';
            this.dashboard.style.display = 'none';

            this.add_task_btn.addEventListener('click', ()=>{
                this.addTask();
                this.dragAndDrop();
                task_input.value = '';
            });
        }
        else{
            this.createNewProject();
            
            this.add_task_btn.addEventListener('click', ()=>{
                this.addTask();
                this.dragAndDrop();
                task_input.value = '';
            });
        }
    }

    init(){
        this.trelloHandler();
    }
}

const trello = new Trello;
trello.init();