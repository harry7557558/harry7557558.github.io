## Factored sum of powers polynomials

Using the above script, I computed the [coefficients of $$f_p$$ from power $$0$$ to power $$99$$](sumpow.html). Below are $$f_p$$ from power $$1$$ to power $$10$$ as well as their factored form:

$$f_1(n)={\sum_{k=1}^{n}k^{1}=\frac{1}{2}n^{2}+\frac{1}{2}n=\frac{1}{2}n\left(n+1\right)}$$

$$f_2(n)={\sum_{k=1}^{n}k^{2}=\frac{1}{3}n^{3}+\frac{1}{2}n^{2}+\frac{1}{6}n=\frac{1}{6}n\left(n+1\right)\left(2n+1\right)}$$

$$f_3(n)={\sum_{k=1}^{n}k^{3}=\frac{1}{4}n^{4}+\frac{1}{2}n^{3}+\frac{1}{4}n^{2}=\frac{1}{4}n^{2}\left(n+1\right)^{2}}$$

$$f_4(n)={\sum_{k=1}^{n}k^{4}=\frac{1}{5}n^{5}+\frac{1}{2}n^{4}+\frac{1}{3}n^{3}-\frac{1}{30}n=\frac{1}{30}n\left(n+1\right)\left(2n+1\right)\left(3n^{2}+3n-1\right)}$$

$$f_5(n)={\sum_{k=1}^{n}k^{5}=\frac{1}{6}n^{6}+\frac{1}{2}n^{5}+\frac{5}{12}n^{4}-\frac{1}{12}n^{2}=\frac{1}{12}n^{2}\left(n+1\right)^{2}\left(2n^{2}+2n-1\right)}$$

$$f_6(n)={\sum_{k=1}^{n}k^{6}=\frac{1}{7}n^{7}+\frac{1}{2}n^{6}+\frac{1}{2}n^{5}-\frac{1}{6}n^{3}+\frac{1}{42}n=\frac{1}{42}n\left(n+1\right)\left(2n+1\right)\left(3n^{4}+6n^{3}-3n+1\right)}$$

$$f_7(n)={\sum_{k=1}^{n}k^{7}=\frac{1}{8}n^{8}+\frac{1}{2}n^{7}+\frac{7}{12}n^{6}-\frac{7}{24}n^{4}+\frac{1}{12}n^{2}=\frac{1}{24}n^{2}\left(n+1\right)^{2}\left(3n^{4}+6n^{3}-n^{2}-4n+2\right)}$$

$$f_8(n)={\sum_{k=1}^{n}k^{8}=\frac{1}{9}n^{9}+\frac{1}{2}n^{8}+\frac{2}{3}n^{7}-\frac{7}{15}n^{5}+\frac{2}{9}n^{3}-\frac{1}{30}n=\frac{1}{90}n\left(n+1\right)\left(2n+1\right)\left(5n^{6}+15n^{5}+5n^{4}-15n^{3}-n^{2}+9n-3\right)}$$

$$f_9(n)={\sum_{k=1}^{n}k^{9}=\frac{1}{10}n^{10}+\frac{1}{2}n^{9}+\frac{3}{4}n^{8}-\frac{7}{10}n^{6}+\frac{1}{2}n^{4}-\frac{3}{20}n^{2}=\frac{1}{20}n^{2}\left(n+1\right)^{2}\left(n^{2}+n-1\right)\left(2n^{4}+4n^{3}-n^{2}-3n+3\right)}$$

$$f_{10}(n)={\sum_{k=1}^{n}k^{10}=\frac{1}{11}n^{11}+\frac{1}{2}n^{10}+\frac{5}{6}n^{9}-n^{7}+n^{5}-\frac{1}{2}n^{3}+\frac{5}{66}n\\=\frac{1}{66}n\left(n+1\right)\left(2n+1\right)\left(n^{2}+n-1\right)\left(3n^{6}+9n^{5}+2n^{4}-11n^{3}+3n^{2}+10n-5\right)}$$

One should notice some patterns in the polynomials:

- When terms are written in decreasing power, the polynomial $$f_p$$ always begins with $$\dfrac{1}{p+1}n^{p+1}+\dfrac{1}{2}n^p$$;

- For $$p\ge 2$$, $$f_p$$ always contain factor $$\dfrac{1}{6}n(n+1)(2n+1)$$ when $$p$$ is even and factor $$\dfrac{1}{4}n^2(n+1)^2$$ when $$p$$ is odd.

Two years ago, when I first generated these equations, I could explain:

- $$f_p(n)$$ contains factor $$n$$ because $$f_p(0)$$ is always $$0$$, $$n=0$$ is a root of $$f_p$$, so $$f_p$$ contains factor $$n-0=n$$;

- Since $$f_p(n)=n^p+f_p(n-1)$$, $$f_p(n-1)=f_p(n)-n^p$$, $$f_p(-1)=f_p(0)-0^p=f_p(0)=0$$, $$n=-1$$ is a root of $$f_p$$, so $$f_p$$ also contains factor $$n+1$$;

- $$\dfrac{1}{4}n^2(n+1)^2$$ is integer because one of $$n$$ and $$n+1$$ must be even and so $$n^2(n+1)^2$$ is divisible by 4;

- One of $$n$$ and $$n+1$$ must be even so $$n(n+1)(2n+1)$$ contains factor 2; When $$n\equiv 1 (\mod 3)$$, $$2n+1$$ is divisible by 3; when $$n\equiv 2 (\mod 3)$$, $$n+1$$ is divisible by 3; otherwise $$n$$ is divisible by 3, so $$n(n+1)(2n+1)$$ also contains factor 3. $$n(n+1)(2n+1)$$ is divisible by both $$2$$ and $$3$$ so $$\dfrac{1}{6}n(n+1)(2n+1)$$ is integer.

I couldn't explain why $$f_p$$ always begin with $$\dfrac{1}{p+1}n^{p+1}+\dfrac{1}{2}n^p$$ and didn't know why $$n(n+1)(2n+1)$$ and $$n^2(n+1)^2$$ appear as factors of $$f_p$$.

