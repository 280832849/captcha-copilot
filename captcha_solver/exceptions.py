class CaptchaSolverError(Exception):
    pass


class UnsupportedCaptchaTypeError(CaptchaSolverError):
    pass


class CaptchaProcessingError(CaptchaSolverError):
    pass


class CaptchaRecognitionError(CaptchaSolverError):
    pass


class ConfigurationError(CaptchaSolverError):
    pass
