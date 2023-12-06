import logging

class Singleton(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]


class Logger(metaclass=Singleton):
    def __init__(self, level=logging.DEBUG, filename='app.log'):
        self.logger = logging.getLogger()
        self.logger.setLevel(level)
        formatter = logging.Formatter('%(asctime)s %(levelname)s:%(message)s')
        file_handler = logging.FileHandler(filename)
        file_handler.setFormatter(formatter)
        self.logger.addHandler(file_handler)

    def get_logger(self):
        return self.logger