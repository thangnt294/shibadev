import { useState } from "react";
import { Select, Button, Avatar, Badge, InputNumber, Image } from "antd";

const { Option } = Select;

const CourseCreateForm = ({
  handleSubmit,
  handleImage,
  handleChange,
  values,
  setValues,
  preview,
  uploadBtnText,
  loading,
  uploading,
  handleRemoveImage = (f) => f,
  editPage = false,
  tags,
  handleSelectTag,
}) => {
  const children = [];
  for (let i = 9.99; i <= 100.99; i += 10) {
    children.push(<Option key={i.toFixed(2)}>${i.toFixed(2)}</Option>);
  }

  return (
    <>
      {values && (
        <form onSubmit={handleSubmit}>
          <div className="form-group pb-3">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Name"
              value={values.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group pb-3">
            <textarea
              name="description"
              cols="7"
              rows="7"
              value={values.description}
              className="form-control"
              onChange={handleChange}
              placeholder="Description"
            />
          </div>

          <div className="col form-group pb-3">
            <Select
              mode="tags"
              allowClear
              style={{ width: "100%" }}
              placeholder="Tags"
              size="large"
              onChange={handleSelectTag}
              value={values.tags}
            >
              {tags && tags.map((tag) => <Option key={tag}>{tag}</Option>)}
            </Select>
          </div>

          <div className="form-row pb-3 d-flex">
            <div className="col-md-1">
              <div className="form-group">
                <Select
                  style={{ width: "100%" }}
                  size="large"
                  value={values.paid}
                  onChange={(v) => setValues({ ...values, paid: v })}
                >
                  <Option value={true}>Paid</Option>
                  <Option value={false}>Free</Option>
                </Select>
              </div>
            </div>

            {values.paid && (
              <div className="col ms-3">
                <div className="form-group">
                  <InputNumber
                    value={values.price}
                    name="price"
                    placeholder="Price"
                    defaultValue="9.99"
                    onChange={(v) => setValues({ ...values, price: v })}
                    min={9.99}
                    max={500}
                    size="large"
                    formatter={(value) =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </div>
              </div>
            )}
          </div>

          <Image width={200} src={preview} placeholder fallback="/course.png" />

          <div className="form-row pb-3 pt-3 d-flex">
            <div className="form-group">
              <label className="btn btn-outline-secondary text-left">
                {uploadBtnText}
                <input
                  type="file"
                  name="image"
                  onChange={handleImage}
                  accept="image/*"
                  hidden
                />
              </label>
            </div>
            {preview && (
              <div className="form-group ms-3">
                <Button
                  onClick={handleRemoveImage}
                  disabled={loading || uploading}
                  className="btn btn-primary"
                  type="danger"
                  size="large"
                  style={{ borderRadius: "5px" }}
                  // shape="round"
                >
                  Remove Image
                </Button>
              </div>
            )}
          </div>

          <div className="row">
            <div className="col">
              <Button
                onClick={handleSubmit}
                disabled={loading || uploading}
                className="btn btn-primary"
                loading={loading}
                type="primary"
                size="large"
                shape="round"
              >
                {loading ? "Saving..." : "Save & Continue"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default CourseCreateForm;
