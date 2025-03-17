export const checkMaintenanceMode = (req, res, next) => {
    if (process.env.MAINTENANCE_MODE === "true") {
        return res.status(503).json({
            success: false,
            message: "The system is currently under maintenance. Please try again later.",
        });
    }
    next();
};
