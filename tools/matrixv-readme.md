# Simple 3D Matrix Visualizer

By Harry Chen - I created this tool in 2019 when I just started learning computer graphics. It seems to have become the main source of my site's traffic so I write this readme to answer some questions that users might have.

This tool visualizes a $4\times4$ [affine matrix](https://en.wikipedia.org/wiki/Transformation_matrix#Affine_transformations) applied to R3. The gray cube and dimed axes are the untransformed and the yellow cube and axes with a higher contrast are with the matrix applied. The untransformed cube has a side length of $4$ units (with vertex coordinate components $-2$ and $2$) and each axis arrow has a half-length of $6$ units.

The transformation matrix is multiplied to the left of the vector. The blue block is the geometry, the green column is the translation, the red row is the perspective, and the yellow number at the bottom right controls the scaling. If you are not a fan of computer graphics and are only interested in matrices in grade-school math, you can ignore the additional dimension and only play with the blue $3\times3$ matrix.

You can click the "3D view" button on the bottom right to limit the viewport to 2D and click it again to go back to 3D. You may be surprised that you can enter expressions like `sqrt(2)` and `sin(pi/3)` as a matrix component, which is powered by [math.js](https://mathjs.org/). Note that although this tool supports computation for complex eigenpairs, your input for matrix components must be real.

I find it intuitive to add determinants and eigenpairs to this visualizer. The $2\times2$ determinant corresponds to the matrix in the top left block and the $4\times4$ determinant only shows up if you modify numbers outside the blue block. This tool calculates and visualizes the $3\times3$ eigenpairs by default, but it is also capable of calculating the eigenpairs of the $4\times4$ matrix if you play with the additional dimension.

Eigenvectors are plotted with the same magnitude as the corresponding eigenvalue. A magenta arrow corresponds to a positive eigenvalue and a blue arrow corresponds to a negative one. The exceptions are zero eigenvectors, which are plotted as a green unit vector. Note that eigenpairs are computed numerically and are not always reliable.

If you find this tool helpful, make sure you check my other stuff like the [3D implicit surface grapher](https://harry7557558.github.io/spirula/implicit3/index.html), the [complex domain coloring grapher](https://harry7557558.github.io/spirula/complex/index.html), my [Desmos](https://harry7557558.github.io/desmos/index.html) and [Shadertoy](https://harry7557558.github.io/shadertoy/index.html) pages, and more on the random link of my [website homepage](https://harry7557558.github.io/). You are free to share my tools with others via URLs. If you found a bug or have a feature request, don't hesitate to submit an issue/PR on GitHub.
