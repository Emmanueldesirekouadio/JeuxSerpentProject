window.onload = function(){ // fonction va etre lancer lorsque la fenetre va s'afficher
    
    var canvasWidth = 900 ;
    var canvasHeight = 600 ;
    var blockSize = 30;
    var ctx ;
    var delay = 100;//les temps st exprimés dans le code en ms , donc 1000ms = 1s
    var snakee;
    var applee;
    var widthInBlock = canvasWidth /blockSize ;
    var heightInBlock = canvasHeight/blockSize; 

    init();


    function init(){ // un nom standart pour les fonction qui permettent d'inititialiser les choses 
        var canvas = document.createElement('canvas');// le canvas est un élement HTML5 qui permet de dessiner dans notre page web
        canvas.width = canvasWidth ; 
        canvas.height = canvasHeight ;
        canvas.style.border = "1px solid";
        document.body.appendChild(canvas);//cest une methode qui permet d'accrocher le canvas de sa position actuelle à un élément body(document entier de notre page HTML)
        ctx = canvas.getContext('2d');// c'est une methode qui retourne le contexte de dessin  sur canvas ou null si l'id  du ctx n'est pas supporté. 
        snakee = new snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
        applee = new apple([10,10]) ;
        refreshCanvas();

    }
    function refreshCanvas(){
        snakee.advance();
        if(snakee.checkCollision()){
            //game OVER
        }else{
            ctx.clearRect(0,0,canvasWidth, canvasHeight);
            snakee.draw();
            applee.draw();
            setTimeout(refreshCanvas,delay);// permet d'exeucter une certaine fonction à chaque fois qu'un certains délai est passé
        

        }
        
    }
    function drawBlock(ctx,position){ // fonction permmettant de creer un bloc
        var x = position[0]*blockSize ; //l'axe des abcsisse position[o] et position[1] pour les ordonnées
        var y = position[1]*blockSize ;
        ctx.fillRect(x , y , blockSize , blockSize);//dessine un rectangle plein aux coordonnées (X;Y)
    }
    function snake(body , direction){ // class snake 
        this.body =body ;
        this.direction = direction ;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle ="#FF0000";// specifie la couleur ou le style à utiliser à l'interieur du canvas
            for(var i = 0 ;i < this.body.length; i++){ 
                drawBlock(ctx,this.body[i]); 

        }
        ctx.restore();
    };
    this.advance = function(){
        var nextPosition = this.body[0].slice();// slice : variable qui copy la nouvelle position du body
        switch(this.direction){
            

            case "left" :
                nextPosition[0] -= 1; 
                break ;

            case "right":
                nextPosition[0] += 1;
                break;

            case "down" : 
                nextPosition[1] += 1;
                break;

            case "up":
                nextPosition[1] -= 1;
                break;
                default :
                throw("Invalid Direction !") ;
        }
        this.body.unshift(nextPosition);
        this.body.pop();
    };
    this.setDirection =function(newDirection){
        var allowedDirections ;
        switch(this.direction){  
            case "left" :
            case "right":
                allowedDirections= ["up" , "down"];
                break;
    
            case "down":
            case "up":
                allowedDirections = ["left","right"] ;
                break; 

                default:
                    throw("Invalid Direction !"); 
            }
            if(allowedDirections.indexOf(newDirection) > -1){ // revoie l'index des eléments du tableau allowedDirections puis les compare à 1
                this.direction = newDirection ;
            }
    };
    this.checkCollision = function(){
        var wallCollision = false ;// var qui permet de savoir si le serpent s'est pris un mur
        var snakeCollision = false ; // var qui permet de savoir si le serpent est passé sur son propre corps
        var head = this.body[0];
        var rest = this.body.slice(1);
        var snakeX = head[0];
        var snakeY = head[1];
        var minX = 0 ;
        var minY = 0 ;
        var maxX = widthInBlock - 1 ;
        var maxY = heightInBlock - 1 ;
        var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX ;
        var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            if(isNotBetweenHorizontalWalls||isNotBetweenVerticalWalls){
                wallCollision = true ;
            }
            for(var i = 0 ;i < rest.length ;i++){
                if(snakeX === rest[i][0]  &&  snakeY === rest[i][1]){
                    snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision ;
    };
    this.isEatingApple = function(appleToEat){ // methode qui permet de savoir si le serpent est entrain de manger une pomme.
        var head = this.body[0];// la tete est egale au corps à la place 0 ; 
        if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])// on verifie si les coordonnées du x de la tete du serpent est égale au x de la pomme pareil pour le y ;
        return true ;    
        else
        return false ;                                                                             
    }

}

function apple(position){ // class pomme
    this.position = position;
    this.draw = function() {
        ctx.save();//enregistSre
        ctx.fillStyle = "#33cc33" ;
        ctx.beginPath();
        var radius =blockSize/2 ;
        var x = this.position[0]*blockSize + radius ;
        var y = this.position[1]*blockSize + radius;
        ctx.arc(x , y ,radius , 0,Math.PI*2 , true);
        ctx.fill();
        ctx.restore();//actualise les propriétés enregistre
    };
}



document.onkeydown = function handleKeyDown(e){
    var key =e.keyCode;
    var newDirection ;
    switch(key){
        case 37 :
            newDirection="left" ;
            break;
        case 38 :
            newDirection = "up" ;
            break;
        case 39 :
            newDirection = "right";
            break;
        case 40 : 
            newDirection = "down";
            break;
            default:
            return;
    }
    snakee.setDirection(newDirection);
};
}
