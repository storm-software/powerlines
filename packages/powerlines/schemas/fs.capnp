@0xa56c61324b9d6e49;

# Additional metadata associated with a file in the file system.
struct FileMetadata {
    # The identifier for the file data.
    id @0 :Text;
    # The variant of the file.
    variant @1 :Text = "normal";
    # The output mode of the file.
    mode @2 :Text;
    # Additional metadata associated with the file.
    properties @3 :List(KeyValuePair);

    struct KeyValuePair {
        key @0 :Text;
        value @1 :Text;
    }
}

# A mapping between a file path and its unique identifier.
# Note: Multiple paths can map to the same identifier (e.g., symlinks).
struct FileIdentifier {
    # A virtual (or actual) path to the file in the file system.
    path @0 :Text;
    # An additional identifier for the file.
    id @1 :Text;
}

# A virtual representation of a file in the file system.
struct FileData {
    # A virtual (or actual) path to the file in the file system.
    path @0 :Text;
    # The contents of the file.
    content @1 :Text;
}

# A virtual representation of a file system containing multiple files.
struct FileSystemData {
    ids @0 :List(FileIdentifier);
    metadata @1 :List(FileMetadata);
    files @2 :List(FileData);
}
