const colors = ['blue', 'black', 'green', 'violet', 'yellow', 'pink', 'red', 'purple', ];

const randomColor = () => {
    return colors [Math.floor(Math.random() * colors.length)];
};

module.exports = randomColor;