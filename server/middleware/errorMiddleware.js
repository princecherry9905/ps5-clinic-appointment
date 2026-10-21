const notFound = (req, res) => {
    res.status(404).json({ message: "Route not found: " + req.originalUrl });
};

const errorHandler = (err, req, res, next) => {
    if (err.name === "CastError") {
        return res.status(400).json({ message: "Invalid id." });
    }

    if (err.name === "ValidationError") {
        const messages = [];
        for (const field in err.errors) {
            messages.push(err.errors[field].message);
        }
        return res.status(400).json({ message: messages.join(" ") });
    }

    if (err.code === 11000) {
        return res.status(409).json({ message: "This record already exists." });
    }

    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ message: "Invalid JSON in request body." });
    }

    console.log(err);
    res.status(500).json({ message: "Something went wrong on the server." });
};

module.exports = { notFound, errorHandler };
