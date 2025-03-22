import { Breadcrumb } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "./CustomBreadcrumb.module.css";
import ArrowLeft from "../../static/img/arrow-left.png";
const CustomBreadcrumb = ({ isBack, handleTableClick, breadcrumbsLabel }) => {
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(-1);
  };
  return (
    <Breadcrumb className={styles.breadcrumb}>
      {isBack ? (
        <div
          className={`${styles.backContainer} cursor`}
          onClick={handleTableClick ? handleTableClick : handleBackClick}
        >
          <img alt="back_icon" src={ArrowLeft} className={styles.backArrow} />
          <div className={styles.back}>Back</div>
          <div className={styles.divider}></div>
        </div>
      ) : (
        <></>
      )}
      <div className={styles.labeltext}>{breadcrumbsLabel}</div>
    </Breadcrumb>
  );
};

export default CustomBreadcrumb;
