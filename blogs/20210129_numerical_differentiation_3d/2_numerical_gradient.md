## Numerical gradient: forward differentiation and central difference

Calculating numerical gradient in higher dimensions seems to be straightforward. By definition, $\nabla f = \begin{pmatrix}\frac{\partial f}{\partial x_1}&\frac{\partial f}{\partial x_2}&\cdots&\frac{\partial f}{\partial x_d}\end{pmatrix}^T$. Calculating the numerical derivative in each dimension using the one dimensional method and combine the components together one can get the numerical gradient in high dimension.

We have seen the forward differentiation in one dimension:

$\dfrac{\partial f}{\partial x} \approx \dfrac{f(x+h)-f(x)}{h}+\dfrac{h}{2}f''(x)$

Apply it to high dimension:

$\nabla f\approx\dfrac{1}{h}\begin{bmatrix}f(\mathbf{x}+h\mathbf{e}_i)-f(\mathbf{x})\text{\ for\ } \mathbf{e}_i \text{\ in each dimension}\end{bmatrix}^T$

The error is approximately $\dfrac{h}{2}\begin{pmatrix}\dfrac{\partial^2 f}{\partial x_1^2}&\dfrac{\partial^2 f}{\partial x_2^2}&\cdots&\dfrac{\partial^2 f}{\partial x_d^2}\end{pmatrix}^T$.

Using central difference:

$\nabla f\approx\dfrac{1}{2h}\begin{bmatrix}f(\mathbf{x}+h\mathbf{e}_i)-f(\mathbf{x}-h\mathbf{e}_i)\text{\ for\ } \mathbf{e}_i \text{\ in each dimension}\end{bmatrix}^T$

In each dimension, the error is approximately $\dfrac{h^2}{6}\dfrac{\partial^3 f}{\partial x_i^3}$.

The central difference has a higher order of accuracy than forward differentiation. However, note that forward differentiation requires $N+1$ samples for a $N$ dimensional function ($N$ samples if $f(\mathbf{x})$ is already evaluated), and central difference requires $2N$ samples. If the function we needs to differentiate is very expensive to evaluate, the central difference method requires more calculation cost.
