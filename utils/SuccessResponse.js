const SuccessResponse = (res,statusCode,data) => {
    return res.status(statusCode).json({
        success: true,
        ...data
    });
}

export default SuccessResponse;