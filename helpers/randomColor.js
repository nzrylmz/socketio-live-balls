const colors = ['blue', 'red', 'green', 'violet', 'pink', 'purple', 'black', 'yellow', ];

const randomColor = () => {
    return colors [Math.floor(Math.random() * colors.length)];
};

module.exports = randomColor;