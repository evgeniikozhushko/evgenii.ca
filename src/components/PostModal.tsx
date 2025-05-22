import { Modal, Button, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { MARKS, BLOCKS, INLINES } from "@contentful/rich-text-types";
import { Image } from "@nextui-org/react";
import { FC } from "react";

interface PostModalProps {
  post: any | null;
  open: boolean;
  onClose: () => void;
}

const PostModal: FC<PostModalProps> = ({ post, open, onClose }) => {
  if (!post) return null;

  const { title, content, coverImage } = post.fields;
  const imageUrl = coverImage?.fields?.file?.url
    ? `https:${coverImage.fields.file.url}`
    : "";

  const renderContent = (node: any) => {
    const options = {
      renderMark: {
        [MARKS.CODE]: (text: any) => <code>{text}</code>,
      },
      renderNode: {
        [BLOCKS.PARAGRAPH]: (_: any, children: any) => <p>{children}</p>,
        [INLINES.HYPERLINK]: (node: any, children: any) => (
          <a href={node.data.uri} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
      },
    };
    return documentToReactComponents(node, options);
  };

  return (
    <Modal isOpen={open} onClose={onClose} size="lg">
      <ModalContent>
        <ModalHeader>
          <h3 className="text-xl font-semibold">{title}</h3>
        </ModalHeader>
        <ModalBody>
          {imageUrl && (
            <Image src={imageUrl} alt={title} width="100%" className="mb-4" />
          )}
          {content && content.nodeType === "document"
            ? renderContent(content)
            : <p>No additional content.</p>}
        </ModalBody>
        <ModalFooter>
          <Button onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PostModal;
