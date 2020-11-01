![Logo](https://www.flaticon.com/svg/static/icons/svg/2762/2762438.svg)

# **Shikshak** - HackThisFall'20

### Academics made Affordable.

---

## A Preview of What Shikshak Is:

## Landing page:

![Home Screenshot](./assets/screenshot-home.png)

## Calibrating Board on Teacher's End

![Calibration Screenshot](./assets/screenshot-calibrate.png)

## Board Preview on the Students Canvas

![Preview Screenshot](./assets/screenshot-preview.png)

## The problem Shikshak solves

> During this pandemic, the online classes and the work from home charades easily consume over 3GB of a person's network data. This might seem normal for a person middle-class or above, but the weekly cost of such a high bandwidth is not viable for everyone, especially for the ones looking for affordable education. This is where "Shikshak" helps the needy. We provide a low-bandwidth solution to attending online classes through our portal. The magic happens in how we transmit the image of the board on which the teacher is writing. We heavily compress it to the format such that there is almost an 85% decrease in internet consumption using our product. From the machine learning perspective following are some challenges we faced: detect corners of the blackboard, make a suitable boundary of the best-suited blackboard as understood by machine learning, define final edges of the blackboard, dot map the pixels to understand the written content on the blackboard.

## Challenges we ran into

> The major hurdle on the web development side was to configure webRTC in such a way so that students can only use an audio channel for real-time communication with the teacher. The second hurdle was to bring the frames of the teacher's video down to such a format so that net consumption can be decreased.

## Features offered by Shikshak

- ### **Corner Detection**
  - Using `opencv`, `imutils` to recognise end pooints of the board.
- ### **Edge Detection**
  - Combinations to figure out best possible board-frame and detecting its edges.
- ### **Pixel Mapping**
  - Using `canny` to transform image to first a Gaussian Blur, and eventually its pixels.
- ### **Real-time Audio Communication**
  - The Teacher is in constant contact with the Student(s) using `webRTC` audio channels.
- ### **Efficient & Real-time transmission of data**
  - Scanning of the board, generation of pixel array, and real-time transmission of this array via `Socket.IO` and plotting the pixels on the Students canvas using `Canvas API`.

## Technology Stack and Dependencies

- **ML**
  - numpy
  - imutils
  - opencv
  - pickle
  - canny
  - matplotlib
  - scipy.spatial
- **APIs**
  - Node.js
  - Express in TypeScript
  - Socket.IO
  - Flask
- **Front-end**
  - React.js in TypeScript-XML
  - Tailwind CSS
  - Socket.IO - Client
  - webRTC
  - Canvas API

# Thank You!

<h1 align="center"> Contributors </h1>
<table align="center">
<tr align="center">
<td>
<strong>Abhishek Saxena</strong>
<p align="center">
<img src = "https://avatars0.githubusercontent.com/u/33656173?s=400&u=a411c58cfffec9bf59da192674093abf4b82bd04&v=4"  height="120" alt="Abhishek Saxena">
</p>
<p align="center">
<a href = "https://github.com/saxenabhishek"><img src = "http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height = "36"/></a>
<a href = "https://www.linkedin.com/in/abhibored">
<img src = "http://www.iconninja.com/files/863/607/751/network-linkedin-social-connection-circular-circle-media-icon.svg" width="36" height="36"/>
</a>
</p>
</td>
<td>
<strong>Ansh Sharma</strong>
<p align="center">
<img src = "https://avatars2.githubusercontent.com/u/60016461?s=400&u=9e9d50e037da73a840a5c43f8f2c2b98942452aa&v=4"  height="120" alt="Ansh Sharma">
</p>
<p align="center">
<a href = "https://github.com/DaemonOnCode"><img src = "http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height = "36"/></a>
<a href = "https://www.linkedin.com/in/anshsharma09">
<img src = "http://www.iconninja.com/files/863/607/751/network-linkedin-social-connection-circular-circle-media-icon.svg" width="36" height="36"/>
</a>
</p>
</td>
</tr>
</table>
<table align="center">
<tr align="center">
<td>
<strong>Gita Alekhya Paul</strong>
<p align="center">
<img src = "https://avatars3.githubusercontent.com/u/54375111?s=460&u=0585ce48d7a98d878ee16041d73695e37b17ade0&v=4"  height="120" alt="Gita Alekhya Paul">
</p>
<p align="center">
<a href = "https://github.com/gitaalekhyapaul"><img src = "http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height = "36"/></a>
<a href = "https://www.linkedin.com/in/gitaalekhyapaul">
<img src = "http://www.iconninja.com/files/863/607/751/network-linkedin-social-connection-circular-circle-media-icon.svg" width="36" height="36"/>
</a>
</p>
</td>
<td>
<strong>Yashvardhan Jagnani</strong>
<p align="center">
<img src = "https://avatars0.githubusercontent.com/u/60016972?s=460&u=44becacb17c82494c8a16c1d17f9f7183f8d67c3&v=4"  height="120" alt="Yashvardhan Jagnani">
</p>
<p align="center">
<a href = "https://github.com/jagnani73"><img src = "http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height = "36"/></a>
<a href = "https://www.linkedin.com/in/yashvardhan-jagnani">
<img src = "http://www.iconninja.com/files/863/607/751/network-linkedin-social-connection-circular-circle-media-icon.svg" width="36" height="36"/>
</a>
</p>
</td>
</tr>
</table>
