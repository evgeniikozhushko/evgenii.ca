import {
  Modal,
  Button,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Link,
} from "@nextui-org/react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { MARKS, BLOCKS, INLINES } from "@contentful/rich-text-types";
import { Image } from "@nextui-org/react";
import { FC } from "react";

interface PostModalProps {
  post: any | null;
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  onNext: () => void;
}

const PostModal: FC<PostModalProps> = ({
  post,
  open,
  onClose,
  onBack,
  onNext,
}) => {
  if (!post) return null;

  const { title, content, coverImage, postType } = post.fields;
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
          <Link isExternal href={node.data.uri} className="pointer-events-auto">
            {children}
          </Link>
        ),
      },
    };
    return documentToReactComponents(node, options);
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      size="2xl"
      style={{ top: "5vh", position: "absolute" }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col items-start">
          <h3 className="text-xl font-semibold">
            {title}
            </h3>
          <h6 className="text-gray-500 font-medium text-xs uppercase">
            {postType}
          </h6>
        </ModalHeader>
        <ModalBody>
          {imageUrl && (
            <Image src={imageUrl} alt={title} width="100%" className="mb-4" />
          )}
          {content && content.nodeType === "document" ? (
            renderContent(content)
          ) : (
            <p>No additional content.</p>
          )}
        </ModalBody>
        <ModalFooter className="flex justify-end">
          <Button variant="flat" onPress={onBack} disabled={false}>
            ← Back
          </Button>
          <Button variant="flat" onPress={onClose}>
            Close
          </Button>
          <Button onPress={onNext} disabled={false}>
            Next →
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PostModal;
