document.addEventListener("DOMContentLoaded", function () {
    const animationSection = document.querySelector(".images-section");
    const imgLeft = document.querySelector('.side-container.left .image');
    const imgRight = document.querySelector('.side-container.right .image');
    const brainInfo = document.querySelectorAll(".brain-info");

    let percentScrolled = 0;
    let oldPercent = 0;
    let direction = "none";

// Pour la fonction scale down
    let isFirstValue = true;
    let firstPercentScrolledValue = null;
    let secondPercentScrolledValue = null;
    let scrollPercentage = 0;
    let baseScale = 1; 
    let maxScale = 0.8;  
    let scaleValue = baseScale; 

    function setScrollVar() {
        if (animationSection) {
            const sectionRect = animationSection.getBoundingClientRect();
            const sectionTop = sectionRect.top;
            const sectionHeight = sectionRect.height;
            const viewportHeight = window.innerHeight;
    
            // Calcul du pourcentage de défilement en fonction de la position de la section dans la vue
            percentScrolled = ((viewportHeight - sectionTop) / (sectionHeight + viewportHeight)) * 100;
    
            // Pour que percentScrolled reste dans la plage de 0 à 100
            percentScrolled = Math.min(Math.max(percentScrolled, 0), 100);
    
            if (percentScrolled > oldPercent) {
                direction = "down";
            } else if (percentScrolled < oldPercent) {
                direction = "up";
            }
    
            oldPercent = percentScrolled;    
            animation();
        }
    }
    


    // Fonction pour appliquer une transition CSS à un élément avec cubic-bezier
    function applyTransition(element, transitionProperty, transitionValue) {
        element.style.transition = `${transitionProperty} 0.5s linear`;
        element.style.transform = transitionValue;
    }

    // FONCTIONS D'ANIMATIONS

    function animateY() {
        applyTransition(imgLeft, 'transform', 'translateY(-50%)');
        applyTransition(imgRight, 'transform', 'translateY(50%)');
    }

    function deanimateY() {
        applyTransition(imgLeft, 'transform', 'translateY(0%)');
        applyTransition(imgRight, 'transform', 'translateY(0%)');
    }

    function scaleUp() {
        applyTransition(imgLeft, 'transform', 'translateY(-50%) scale(1.2)');
        applyTransition(imgRight, 'transform', 'translateY(50%) scale(1.2)');
    }

         
    function scaleDown() {
        if (isFirstValue) {
          firstPercentScrolledValue = percentScrolled;    
          secondPercentScrolledValue = firstPercentScrolledValue + (1 * firstPercentScrolledValue);
          isFirstValue = false;
        } else {
          // Calculez le pourcentage en fonction de la position actuelle du scroll entre les valeurs first et second.
          if (percentScrolled >= firstPercentScrolledValue  ) {
            const range = secondPercentScrolledValue - firstPercentScrolledValue;
            scrollPercentage = ((percentScrolled - firstPercentScrolledValue) / range) * 100;    
            // Interpolation linéaire pour calculer currentScale.
            currentScale = baseScale + (maxScale - baseScale) * (scrollPercentage / 50);
      
            if (scrollPercentage < 40) {
                scaleValue = maxScale;
                imgLeft.style.transform = `scale(1) translateY(-50%)`;
                imgRight.style.transform = `scale(1) translateY(50%)`;
              }
            else if (scrollPercentage > 40) {
                scaleValue = maxScale;
                imgLeft.style.transform = `scale(${scaleValue}) translateY(-50%)`;
                imgRight.style.transform = `scale(${scaleValue}) translateY(50%)`;
              }
            else { 
                currentScale = baseScale + (maxScale - baseScale) * (scrollPercentage / 50);

                scaleValue = currentScale;
                imgLeft.style.transform = `scale(${scaleValue}) translateY(-50%)`;
                imgRight.style.transform = `scale(${scaleValue}) translateY(50%)`;
              }
          } 
        }

      }
      
    function hideText() {
        brainInfo.forEach((info) => {
            if (info.classList.contains("brain-info")) {
                info.classList.add("hidden");
            }
        });
    }
    function showText() {
        if (scrollPercentage > 60){
        brainInfo.forEach((info) => {
            if (info.classList.contains("hidden")) {
                info.classList.remove("hidden");
            }
        });
    }}



    function animation() {
        if (percentScrolled > 25 && direction === "down" ) {
            // Animation lorsque vous faites défiler vers le bas
            animateY();
            scaleDown();
            showText();
        } else if (percentScrolled < 50 && direction === "up") {
            hideText();
            scaleUp();
            deanimateY();
        }
    }


    window.addEventListener("resize", setScrollVar);
    window.addEventListener("scroll", setScrollVar);

    setScrollVar();
});
