<template>
    <div class="indexlayout-right-footer">
        <div class="footer-copyright">
            Copyright © 2020-present liqingsong.cc, All Rights Reserved
        </div>
    </div>
</template>
<script>
export default {
    name: 'LayoutIndexRightFooter'
};
</script>
<style lang="scss" scoped>
.indexlayout-right-footer {
    padding: 0px 0 12px;
    height: 20px;
    overflow: hidden;
    text-align: center;
    font-size: 14px;
    color: #808695;
    .footer-links {
        margin-bottom: 10px;
        a {
            margin-right: 30px;
            color: #808695;
            text-decoration: none;
            &:last-child {
                margin-right: 0;
            }
            &:hover{
                color: #515a6e;
            }
        }
    }
}
</style>