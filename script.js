class BufferSystem {
    constructor() {
        this.buffers = [];
        this.processedProducts = [];
        this.currentSequenceNumber = 1;
        this.maxBufferSize = 10;
        this.nextBufferIndex = 0;
        this.usedNumbers = new Set();
        this.maxOffset = 3;
        this.bufferCount = 2;

        // Initialize UI elements
        this.buffersContainer = document.getElementById('buffersContainer');
        this.outputElement = document.querySelector('.output-content');
        this.offsetValueElement = document.querySelector('#offsetValue');
        this.offsetSlider = document.querySelector('#offsetSlider');
        this.bufferCountSlider = document.querySelector('#bufferCountSlider');
        this.bufferCountValue = document.querySelector('#bufferCountValue');
        this.sequenceAccuracyElement = document.querySelector('#sequenceAccuracy');

        // Add event listeners
        document.getElementById('addProduct').addEventListener('click', () => this.addProduct());
        document.getElementById('addRandomProduct').addEventListener('click', () => this.addRandomProduct());
        document.getElementById('processProduct').addEventListener('click', () => this.processNextProduct());
        document.getElementById('restartSimulation').addEventListener('click', () => this.restart());
        
        // Add slider event listeners
        this.offsetSlider.addEventListener('input', (e) => {
            this.maxOffset = parseInt(e.target.value);
            this.offsetValueElement.textContent = this.maxOffset;
        });

        this.bufferCountSlider.addEventListener('input', (e) => {
            this.bufferCount = parseInt(e.target.value);
            this.bufferCountValue.textContent = this.bufferCount;
            this.updateBufferCount();
        });

        // Initialize buffers
        this.updateBufferCount();
    }

    updateBufferCount() {
        // Clear existing buffers
        this.buffers = [];
        this.buffersContainer.innerHTML = '';
        this.nextBufferIndex = 0;

        // Create new buffers
        for (let i = 0; i < this.bufferCount; i++) {
            const buffer = {
                id: `buffer${i + 1}`,
                items: [],
                element: null,
                header: null
            };
            
            const bufferDiv = document.createElement('div');
            bufferDiv.className = 'buffer';
            bufferDiv.id = buffer.id;
            
            const header = document.createElement('h3');
            header.textContent = `Buffer ${i + 1} (0/${this.maxBufferSize})`;
            buffer.header = header;
            
            const content = document.createElement('div');
            content.className = 'buffer-content';
            buffer.element = content;
            
            bufferDiv.appendChild(header);
            bufferDiv.appendChild(content);
            this.buffersContainer.appendChild(bufferDiv);
            
            this.buffers.push(buffer);
        }
    }

    restart() {
        this.buffers.forEach(buffer => {
            buffer.items = [];
            this.updateBufferDisplay(buffer);
        });
        this.processedProducts = [];
        this.currentSequenceNumber = 1;
        this.nextBufferIndex = 0;
        this.usedNumbers.clear();
        this.updateOutputDisplay();
        this.updateSequenceAccuracy();
    }

    updateBufferHeaders() {
        this.buffers.forEach(buffer => {
            buffer.header.textContent = `Buffer ${buffer.id.replace('buffer', '')} (${buffer.items.length}/${this.maxBufferSize})`;
        });
    }

    calculateSequenceAccuracy() {
        if (this.processedProducts.length === 0) return 100;

        let correctSequenceCount = 0;
        let expectedNumber = 1;

        for (const product of this.processedProducts) {
            if (product === expectedNumber) {
                correctSequenceCount++;
            }
            expectedNumber++;
        }

        return Math.round((correctSequenceCount / this.processedProducts.length) * 100);
    }

    updateSequenceAccuracy() {
        const accuracy = this.calculateSequenceAccuracy();
        this.sequenceAccuracyElement.textContent = `${accuracy}%`;
    }

    findNextAvailableNumber(startFrom) {
        let number = startFrom;
        while (this.usedNumbers.has(number)) {
            number++;
        }
        return number;
    }

    addProduct() {
        const hasSpace = this.buffers.some(buffer => buffer.items.length < this.maxBufferSize);
        if (!hasSpace) return;

        const nextNumber = this.findNextAvailableNumber(this.currentSequenceNumber);
        this.usedNumbers.add(nextNumber);
        this.currentSequenceNumber = nextNumber + 1;

        let added = false;
        while (!added) {
            const buffer = this.buffers[this.nextBufferIndex];
            if (buffer.items.length < this.maxBufferSize) {
                buffer.items.push(nextNumber);
                this.updateBufferDisplay(buffer);
                added = true;
            }
            this.nextBufferIndex = (this.nextBufferIndex + 1) % this.buffers.length;
        }

        this.updateBufferHeaders();
    }

    generateRandomProduct() {
        // Find the highest and lowest numbers in the system
        const allNumbers = [
            ...this.buffers.flatMap(buffer => buffer.items),
            ...this.processedProducts,
            this.currentSequenceNumber - 1
        ];
        
        const highestNumber = Math.max(...allNumbers);
        const lowestNumber = Math.min(...allNumbers);
        
        // Calculate the range for random number generation
        // Allow numbers both higher and lower than current sequence
        const minNumber = Math.max(1, lowestNumber - this.maxOffset);
        const maxNumber = highestNumber + this.maxOffset;
        
        // Generate a random number within the range
        const randomNumber = minNumber + Math.floor(Math.random() * (maxNumber - minNumber + 1));
        
        // If the number is already used, find the next available number
        if (this.usedNumbers.has(randomNumber)) {
            return this.findNextAvailableNumber(randomNumber);
        }
        
        return randomNumber;
    }

    addRandomProduct() {
        const hasSpace = this.buffers.some(buffer => buffer.items.length < this.maxBufferSize);
        if (!hasSpace) return;

        const randomNumber = this.generateRandomProduct();
        this.usedNumbers.add(randomNumber);

        let added = false;
        while (!added) {
            const buffer = this.buffers[this.nextBufferIndex];
            if (buffer.items.length < this.maxBufferSize) {
                buffer.items.push(randomNumber);
                this.updateBufferDisplay(buffer);
                added = true;
            }
            this.nextBufferIndex = (this.nextBufferIndex + 1) % this.buffers.length;
        }

        this.updateBufferHeaders();
    }

    processNextProduct() {
        let processed = false;
        let lowestNumber = Infinity;
        let bufferWithLowest = null;

        // Find the buffer with the lowest number at the bottom
        for (const buffer of this.buffers) {
            if (buffer.items.length > 0) {
                const bottomNumber = buffer.items[0]; // Get the bottom number
                if (bottomNumber < lowestNumber) {
                    lowestNumber = bottomNumber;
                    bufferWithLowest = buffer;
                }
            }
        }

        if (bufferWithLowest) {
            // Find the product element at the bottom and add fade-out animation
            const productElements = bufferWithLowest.element.getElementsByClassName('product');
            const bottomProductElement = productElements[0]; // Get the bottom element
            if (bottomProductElement) {
                bottomProductElement.classList.add('fade-out');
            }

            // Wait for animation to complete before removing
            setTimeout(() => {
                bufferWithLowest.items.shift(); // Remove from bottom
                this.processedProducts.push(lowestNumber);
                this.updateBufferDisplay(bufferWithLowest);
                this.updateBufferHeaders();
                this.updateOutputDisplay();
                this.updateSequenceAccuracy();
            }, 500); // Match this with the animation duration
        }
    }

    updateBufferDisplay(buffer) {
        buffer.element.innerHTML = '';
        buffer.items.forEach((item, index) => {
            const productElement = document.createElement('div');
            productElement.className = 'product';
            productElement.textContent = item;
            
            // Add fade-in animation to the last added product
            if (index === buffer.items.length - 1) {
                productElement.classList.add('fade-in');
            }
            
            buffer.element.appendChild(productElement);
        });
    }

    updateOutputDisplay() {
        this.outputElement.innerHTML = '';
        let expectedNumber = 1;
        
        this.processedProducts.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product';
            
            if (product !== expectedNumber) {
                productElement.classList.add('out-of-sequence');
            }
            
            productElement.textContent = `${product} (${expectedNumber})`;
            this.outputElement.appendChild(productElement);
            expectedNumber++;
        });
    }
}

// Initialize the buffer system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new BufferSystem();
}); 