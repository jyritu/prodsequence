# Production Line Buffer Visualization

This web application visualizes a production line buffer system with two parallel buffers. Products a and b go to Buffer 1, while products c and d go to Buffer 2. The system processes products in the sequence a, b, c, d when possible.

## Features

- Visual representation of two parallel buffers
- Random product generation (a, b, c, d)
- Automatic product routing to appropriate buffer
- Sequential product processing (a → b → c → d)
- Real-time visualization of buffer contents and processed products

## How to Use

1. Open `index.html` in a web browser
2. Use the "Add Random Product" button to add products to the buffers
3. Use the "Process Next Product" button to process products in sequence
4. Watch as products move through the buffers and get processed

## Product Flow

- Products a and b are routed to Buffer 1
- Products c and d are routed to Buffer 2
- Products are processed in the sequence: a → b → c → d
- The system will only process a product if it matches the expected sequence

## Technical Details

- Built with HTML, CSS, and JavaScript
- No external dependencies required
- Modern, responsive design
- Color-coded products for easy identification

## File Structure

- `index.html` - Main webpage structure
- `styles.css` - Styling for the visualization
- `script.js` - Buffer logic and visualization functionality 