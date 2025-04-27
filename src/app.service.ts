import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
            font-size: 3rem;
            font-weight: bold;
        }
        
        .letter {
            display: inline-block;
            transition: transform 0.3s;
        }
        
        .letter:hover {
            transform: translateY(-10px);
        }
    </style>
</head>
<body>
    <div>
        <span class="letter" style="color: #FF5733;">H</span>
        <span class="letter" style="color: #33FF57;">e</span>
        <span class="letter" style="color: #3357FF;">l</span>
        <span class="letter" style="color: #F033FF;">l</span>
        <span class="letter" style="color: #FF33F0;">o</span>
        <span class="letter" style="color: #33FFF0;">&nbsp;</span>
        <span class="letter" style="color: #F0FF33;">W</span>
        <span class="letter" style="color: #FF8C33;">o</span>
        <span class="letter" style="color: #8C33FF;">r</span>
        <span class="letter" style="color: #33FF8C;">l</span>
        <span class="letter" style="color: #FF338C;">d</span>
    </div>
</body>
</html>`;
  }
}
