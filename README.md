# Production Line Buffer Visualization

This web application visualizes a production line buffer system with one or more parallel buffers. Products are born and fed to buffer. The system processes products in the sequence when possible.

## Features

- Visual representation of one or more parallel buffers
- In sequence generation
- Random product generation (slider for offset)
- FIFO principle (first in, first out)

- Sequential product processing
- Real-time visualization of buffer contents and processed products

## How to Use

1. Open index.html in a web browser
2. Normal sequence to fill buffers in "normal" sequence
3. Random sequence to generate randomness (slider to modify offset)
4. Process items (tries to pick lowest value).
5. Prcessed items are color coded in red, it they are in wrong order. Right sequence numbers is showed in parenthesis after each number
6. Can reset simulation
7. Shows sequence accuracy statistics

## Product Flow

- Products are processed in the sequence as closely as possible
- If unable to take right one, takes the next smallest in sequence

## Technical Details

- Built with HTML, CSS, and JavaScript
- No external dependencies required
- Modern, responsive design
- Color-coded products for easy identification

## File Structure

- `index.html` - Main webpage structure
- `styles.css` - Styling for the visualization
- `script.js` - Buffer logic and visualization functionality 
