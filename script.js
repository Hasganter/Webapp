document.addEventListener('DOMContentLoaded', (event) => {
    const container = document.querySelector('.container');
    let squares = document.querySelectorAll('.square');
    let draggedSquare = null;
    let offsetX = 0;
    let offsetY = 0;
    let initialX = 0;
    let initialY = 0;

    document.getElementById('addSquareBtn').addEventListener('click', addSquare);

    function addSquare() {
        const newSquare = document.createElement('div');
        newSquare.className = 'square';
        newSquare.setAttribute('draggable', 'true');
        newSquare.innerHTML = `<input type="text" placeholder="Type here"><button class="deleteBtn">X</button>`;
        container.appendChild(newSquare);
        squares = document.querySelectorAll('.square');

        newSquare.addEventListener('mousedown', mouseDown);
        newSquare.querySelector('.deleteBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteSquare(newSquare);
        });
        newSquare.querySelector('input').addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });
    }

    function deleteSquare(square) {
        container.removeChild(square);
        squares = document.querySelectorAll('.square');
    }

    function mouseDown(event) {
        draggedSquare = this;
        const rect = draggedSquare.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;
        initialX = rect.left - containerRect.left;
        initialY = rect.top - containerRect.top;

        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);
        event.preventDefault();
    }

    function mouseMove(event) {
        if (draggedSquare) {
            const containerRect = container.getBoundingClientRect();
            let x = event.clientX - containerRect.left - offsetX;
            let y = event.clientY - containerRect.top - offsetY;

            // Ensure the square stays within the container boundaries
            x = Math.max(0, Math.min(containerRect.width - draggedSquare.offsetWidth, x));
            y = Math.max(0, Math.min(containerRect.height - draggedSquare.offsetHeight, y));

            draggedSquare.style.left = `${x}px`;
            draggedSquare.style.top = `${y}px`;
        }
    }

    function mouseUp(event) {
        if (draggedSquare) {
            const containerRect = container.getBoundingClientRect();
            let x = parseInt(draggedSquare.style.left);
            let y = parseInt(draggedSquare.style.top);

            let snapped = false;

            // Check for overlapping with other blocks
            for (let square of squares) {
                if (square === draggedSquare) continue;
                const rect = square.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                const squareLeft = rect.left - containerRect.left;
                const squareTop = rect.top - containerRect.top;
                const squareBottom = squareTop + square.offsetHeight;

                if (
                    x < squareLeft + square.offsetWidth &&
                    x + draggedSquare.offsetWidth > squareLeft &&
                    y < squareBottom &&
                    y + draggedSquare.offsetHeight > squareTop
                ) {
                    // Snap to the bottom of the overlapping block
                    x = squareLeft;
                    y = squareBottom;
                    snapped = true;
                    break;
                }
            }

            if (snapped) {
                draggedSquare.style.left = `${x}px`;
                draggedSquare.style.top = `${y}px`;
            } else {
                // Free move if not snapping
                draggedSquare.style.left = `${x}px`;
                draggedSquare.style.top = `${y}px`;
            }

            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
            draggedSquare = null;
        }
    }

    function isOverlapping(element) {
        const rect1 = element.getBoundingClientRect();
        for (let square of squares) {
            if (square === element) continue;
            const rect2 = square.getBoundingClientRect();
            if (
                rect1.left < rect2.left + rect2.width &&
                rect1.left + rect1.width > rect2.left &&
                rect1.top < rect2.top + rect2.height &&
                rect1.top + rect1.height > rect2.top
            ) {
                return true;
            }
        }
        return false;
    }

    // Initial setup for existing squares
    squares.forEach(square => {
        square.addEventListener('mousedown', mouseDown);
        square.querySelector('.deleteBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteSquare(square);
        });
        square.querySelector('input').addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });
    });
});
