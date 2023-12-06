from sentence_transformers import SentenceTransformer, util
from PIL import Image
from logger import Logger

logger = Logger().get_logger()

# Load the OpenAI CLIP Model
logger.info('Loading CLIP Model...')

model = SentenceTransformer('clip-ViT-B-32')

# Next we compute the embeddings
# To encode an image, you can use the following code:
# from PIL import Image
def compare_images(base_image, image_to_compare):
    image_names = [base_image, image_to_compare]
    encoded_image = model.encode([Image.open(filepath) for filepath in image_names], batch_size=128, convert_to_tensor=True, show_progress_bar=True)

    # Now we run the clustering algorithm. This function compares images against
    # all other images and returns a list with the pairs that have the highest
    # cosine similarity score
    processed_images = util.paraphrase_mining_embeddings(encoded_image)[0]
    return int(round(processed_images[0] * 100))
